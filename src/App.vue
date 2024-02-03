<template>
  <div class="row justify-center">
    <div class="col-12 row justify-center" style="height: 80vh">
      <div class="col-12-sm q-mx-md" style="width: 500px">
        <h2>Worker registers</h2>
        <register-list v-model:inputs="workerInputs" @onFinish="onFinish" />
      </div>
      <div class="col-12-sm q-mx-md" style="width: 500px">
        <h2>Shift registers</h2>
        <register-list v-model:inputs="shiftInputs" @onFinish="onFinish" />
      </div>
    </div>
    <q-btn class="col-1 q-mt-md" color="primary" label="Confirm" @click="onConfirm"/>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import RegisterList from "./components/RegisterList.vue";

const workerInputs = reactive([]);
const shiftInputs = reactive([]);

const onFinish = (inputs: any[]) => {
  console.log(inputs);
}

const onConfirm = () => {
  console.log(workerInputs, shiftInputs);
};

// setInterval(() => console.log(inputs), 2000);
</script>
