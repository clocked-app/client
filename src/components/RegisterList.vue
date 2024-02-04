<template>
  <div :class="`q-mt-sm register-list-${props.name}`">
    <q-input
      v-for="input of inputs"
      v-model="input.value"
      filled
      mask="##:##"
      :class="`q-ma-xs input-${name}-${input.id}`"
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
          :class="`btn-${name}-${input.id}-add`"
          @click="addInputOnClick()"
        />
        <q-btn
          v-else-if="input.id == nextInputId - 1 && input.id != 1"
          round
          dense
          flat
          icon="remove"
          :class="`btn-${name}-${input.id}-remove`"
          @click="removeLastInputOnClick()"
        />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export interface Input {
  id: number;
  value: string | undefined;
  ref?: VNodeRef;
  autofocus?: boolean;
}

export default defineComponent({
  name: "RegisterList",
});
</script>

<script setup lang="ts">
import { ref, type VNodeRef } from "vue";

const emit = defineEmits(["click:add", "click:remove"]);

let nextInputId = ref(1);
const inputs = defineModel("inputs", { default: [] as Array<Input> });
const props = defineProps({
  name: {
    type: String,
    default: `registerlist_${Date.now()}`,
  },
});

const addInputOnClick = (autofocus: boolean = true) => {
  emit("click:add");
  addInput(autofocus);
};

const addInput = (autofocus: boolean = true) => {
  inputs.value.push({
    id: nextInputId.value++,
    value: undefined,
    ref: `ref-${props.name}-${nextInputId.value - 1}`,
    autofocus,
  });
};

const removeLastInputOnClick = () => {
  emit("click:remove");
  inputs.value.pop();
  nextInputId.value--;
};

const ruleInput = (val: string) => {
  const inputsValue = inputs.value;
  const lastInputValue =
    inputsValue[Math.max(inputsValue.length - 2, 0)]?.value ?? "0";
  return (
    (val && timeStringToMinutes(val) >= timeStringToMinutes(lastInputValue)) ||
    "Please fill a grater time than the last one"
  );
};

const timeStringToMinutes = (time: string): number => {
  if (!time) {
    return 0;
  }
  const timeParts = time.split(":");
  if (timeParts.length != 2) {
    return 0;
  }
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
};

addInput(false);
</script>
