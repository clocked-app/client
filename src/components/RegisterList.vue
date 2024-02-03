<template>
  <div class="q-mt-sm">
    <q-input
      v-for="input of inputs"
      v-model="input.value"
      filled
      mask="##:##"
      class="q-ma-xs"
      :autofocus="input.autofocus || false"
      :ref="input.ref"
      :label="`Register ${input.id}`"
      :key="input.id"
      :rules="[ruleInput]"
      @keypress.enter.prevent="input.value && addInputOnClick()"
    >
      <template v-slot:append>
        <q-btn
          v-if="input.value && input.id >= nextInputId - 1"
          round
          dense
          flat
          icon="add"
          @click="addInputOnClick"
        />
        <q-btn
          v-else-if="input.id == nextInputId - 1 && input.id != 1"
          round
          dense
          flat
          icon="remove"
          @click="removeLastInputOnClick"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const emit = defineEmits(["onFinish"]);

interface Input {
  id: number;
  value: string;
  ref: HTMLElement;
}

let nextInputId = ref(1);
const inputs = defineModel('inputs', { default: [] });

const addInputOnClick = (autofocus: boolean = true) => {
  inputs.value.push({
    id: nextInputId.value++,
    value: null,
    ref: null,
    autofocus,
  });
};

const removeLastInputOnClick = () => {
  inputs.value.pop();
  nextInputId.value--;
};

const showInputs = () => {
  emit("onFinish", inputs);
};

const ruleInput = (val: string) => {
  const inputsValue = inputs.value;
  const lastInputValue = inputsValue[Math.max(inputsValue.length - 2, 0)].value;
  return (
    (val && timeStringToMinutes(val) >= timeStringToMinutes(lastInputValue)) ||
    "Please fill a grater time than the last one"
  );
};

const timeStringToMinutes = (time: string): number => {
  if (!time) {
    return 0
  }
  const timeParts = time.split(":");
  if (timeParts.length != 2) {
    return 0;
  }
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
};

addInputOnClick(false);
</script>
