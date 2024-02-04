<template>
  <div :class="`row justify-center home-view-${props.name}`">
    <h3 class="version">{{ version }}</h3>
    <div class="col-12 row justify-center">
      <div class="col-12-sm q-mx-md worker-list" style="width: 500px">
        <h2 class="list-title">Worker registers</h2>
        <register-list name="worker" v-model:inputs="workerInputs" />
      </div>
      <div class="col-12-sm q-mx-md shift-list" style="width: 500px">
        <h2 class="list-title">Shift registers</h2>
        <register-list name="shift" v-model:inputs="shiftInputs" />
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
import { defineComponent } from "vue";

export interface OnConfirmEvtParams {
  workerInputs: typeof Input;
  shiftInputs: typeof Input;
}

export default defineComponent({
  name: "HomeView",
});
</script>

<script setup lang="ts">
import { reactive } from "vue";
import RegisterList from "./../components/RegisterList.vue";
import Input from "./../components/RegisterList.vue";

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
