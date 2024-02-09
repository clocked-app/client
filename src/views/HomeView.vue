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
import { http } from '../axios';

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

const onConfirm = async () => {
  emit("onConfirm", { registeredInputs, shiftInputs });
  if (inputsInvalid()) {
    return;
  }
  sendRecordsToAPI();
};

const inputsInvalid = () => {
  const invalidFields = [
    ...registeredInputs.filter(i => !i.isValid()),
    ...shiftInputs.filter(i => !i.isValid()),
  ];
  return invalidFields.length > 0;
};

const sendRecordsToAPI = async () => {
  const date = '2023-01-01';
  await http.post('/calculations/day', {
    date,
    registeredRecords: [
      ...registeredInputs.map(r => `${date} ${r.value}`)
    ],
    shiftRecords: [
      ...shiftInputs.map(r => `${date} ${r.value}`)
    ],
  });
};
</script>
