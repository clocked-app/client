<template>
  <div :class="`row justify-center home-view-${props.name}`">
    <h3 class="version">{{ version }}</h3>
    <div class="col-12 row justify-center">
      <div class="col-12-sm q-mx-md worker-list" style="width: 500px">
        <h2 class="list-title">Worker records</h2>
        <record-list name="worker" v-model:inputs="workerInputs" />
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
  workerInputs: Input;
  shiftInputs: Input;
}

export default defineComponent({
  name: "HomeView",
});
</script>

<script setup lang="ts">
import RecordList, { type Input } from "./../components/RecordList.vue";

const emit = defineEmits(["onConfirm"]);
const props = defineProps({
  name: {
    type: String,
    default: `homeview_${Date.now()}`,
  },
});

const workerInputs = reactive([]);
const shiftInputs = reactive([]);
const version = import.meta.env.VITE_CLIENT_VERSION || "v0.0.0";

const onConfirm = () => {
  emit("onConfirm", { workerInputs, shiftInputs });
};
</script>
