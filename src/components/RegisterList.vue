<template>
  <div :class="`q-mt-sm register-list-${props.name}`">
    <q-input
      v-for="input of inputs"
      v-model="input.value"
      filled
      mask="##:##"
      :class="`q-ma-xs input-${name}-${input.id}`"
      :autofocus="input.autofocus || false"
      :ref="(e: Input) => updateInputWithRef(e, input)"
      :label="`Register ${input.id}`"
      :key="input.id"
      :rules="[validRegisterRule, greaterThanRule]"
      @keyup.enter.prevent="addInputOnClick(true, input)"
      @keyup.esc.prevent="removeInputOnClick(input)"
    >
      <template v-slot:append>
        <q-btn
          v-if="isInputAddButtonVisible(input)"
          round
          dense
          flat
          icon="add"
          :class="`btn-${name}-${input.id}-add`"
          @click="addInputOnClick(true, input)"
        />
        <q-btn
          v-else-if="isInputRemoveButtonVisible(input)"
          round
          dense
          flat
          icon="remove"
          :class="`btn-${name}-${input.id}-remove`"
          @click="removeInputOnClick(input)"
        />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export interface Input {
  id: number;
  value: string | undefined;
  isValid: () => boolean;
  ref?: QInput;
  autofocus?: boolean;
}

export default defineComponent({
  name: "RegisterList",
});
</script>

<script setup lang="ts">
import { QInput } from "quasar";

const emit = defineEmits(["click:add", "click:remove"]);

let nextInputId = ref(1);
const inputs = defineModel("inputs", { default: [] as Array<Input> });
const props = defineProps({
  name: {
    type: String,
    default: `registerlist_${Date.now()}`,
  },
});

const addInputOnClick = (
  autofocus: boolean = true,
  input: Input | null = null,
) => {
  if (!input || !isInputAddButtonVisible(input) || !input.isValid()) return;
  emit("click:add");
  addInput(autofocus);
};

const addInput = (autofocus: boolean = true) => {
  inputs.value.push({
    id: nextInputId.value++,
    value: undefined,
    isValid: () => false,
    ref: undefined,
    autofocus,
  });
};

const removeInputOnClick = (input: Input) => {
  if (!isInputRemoveButtonVisible(input)) return;
  emit("click:remove");
  inputs.value.pop();
  nextInputId.value--;
  focusOnLastInput();
};

const validRegisterRule = (val: string) => {
  if (!val) {
    return "Please fill the digits";
  }
  if (val.length != 5) {
    return "Please fill a all digits";
  }

  const [minutes, seconds] = val.split(":");
  if (parseInt(minutes, 10) > 59 || parseInt(seconds, 10) > 59) {
    return "Please fill valid values for minutes and seconds";
  }

  return true;
};

const greaterThanRule = (val: string) => {
  const inputsValue = inputs.value;
  const lastInputValue =
    inputsValue[Math.max(inputsValue.length - 2, 0)]?.value ?? "0";

  if (val && timeStringToMinutes(val) < timeStringToMinutes(lastInputValue)) {
    return "Please fill a grater time than the last one";
  }

  return true;
};

const isInputRemoveButtonVisible = (input: Input) => {
  const inputIsTheLastVisible = input.id == nextInputId.value - 1;
  const inputIsNotTheFirst = input.id != 1;
  return inputIsTheLastVisible && inputIsNotTheFirst;
};

const isInputAddButtonVisible = (input: Input) => {
  const inputHasValue = !!input.value;
  const inputIsTheLastVisible = input.id >= nextInputId.value - 1;
  return inputHasValue && inputIsTheLastVisible;
};

const getLastInput = (): Input | undefined => {
  return inputs.value[inputs.value.length - 1];
};

const focusOnLastInput = () => {
  const lastInput = getLastInput();
  if (!lastInput || !lastInput.ref) return;
  lastInput.ref.focus();
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

const updateInputWithRef = async (e: any, input: Input) => {
  const existingInput = inputs.value.find((i) => i.id == input.id);
  if (!existingInput) return;
  input.ref = e;
  input.isValid = () => {
    return e.validate();
  };
};

addInput(false);
</script>
