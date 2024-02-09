<template>
  <div :class="`row justify-center home-view-${props.name}`">
    <h3 class="version">{{ version }}</h3>
    <div class="col-12 row justify-center">
      <div class="col-12-sm q-mx-md registered-list" style="width: 500px">
        <h2 class="list-title">Registered records</h2>
        <record-list name="registered" v-model:inputs="registeredInputs" />
      </div>
      <div class="col-12-sm q-mx-md shift-list" style="width: 500px">
        <h2 class="list-title">Shift records</h2>
        <record-list name="shift" v-model:inputs="shiftInputs" />
      </div>
    </div>
    <q-btn
      class="col-1 q-my-md confirm"
      color="primary"
      label="Confirm"
      style="width: 100px"
      @click="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export interface OnConfirmEvtParams {
  registeredInputs: Input;
  shiftInputs: Input;
}

export default defineComponent({
  name: "HomeView",
});
</script>

<script setup lang="ts">
import RecordList, { type Input } from "./../components/RecordList.vue";
import { useQuasar } from "quasar";
import {
  getCalculationsFromAPI,
  type Calculation,
} from "../controller/CalculationController";

const emit = defineEmits(["onConfirm"]);
const props = defineProps({
  name: {
    type: String,
    default: `homeview_${Date.now()}`,
  },
});

const registeredInputs: Input[] = reactive([]);
const shiftInputs: Input[] = reactive([]);

const version = import.meta.env.VITE_CLIENT_VERSION || "v0.0.0";
const $q = useQuasar();

const example = () => {
  return 1;
};

example();

const onConfirm = async () => {
  emit("onConfirm", { registeredInputs, shiftInputs });
  if (inputsInvalid()) {
    return;
  }
  const calculations = await getCalculationsFromAPI({
    date: new Date(),
    registeredInputs,
    shiftInputs,
  });
  displayCalculations(calculations);
};

const inputsInvalid = () => {
  const invalidFields = [
    ...registeredInputs.filter((i) => !i.isValid()),
    ...shiftInputs.filter((i) => !i.isValid()),
  ];
  return invalidFields.length > 0;
};

const displayCalculations = (calculations: Calculation[]) => {
  const workTime = (calculations.find((c) => c.type == "WORK") ?? { value: 0 })
    .value;
  const absentTime = (
    calculations.find((c) => c.type == "ABSENT") ?? { value: 0 }
  ).value;

  $q.dialog({
    title: "Calculation Results",
    message: `<i>Work Time:</i> ${workTime}<br><i>Absent Time:</i> ${absentTime}`,
    html: true,
    class: "calculation-dialog",
  });
};
</script>
