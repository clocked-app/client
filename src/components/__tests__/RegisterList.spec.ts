import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import RegisterList from "../RegisterList.vue";

import { Quasar } from "quasar";

describe("RegisterList", () => {
  // Util function to simplify comparation between inputs
  const testableInputProps = (i: any) => {
    return {
      ...i,
      ref: null,
      isValid: null,
    };
  };

  it("renders properly", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    const defaultInputs = [
      {
        id: 1,
        value: undefined,
        ref: "ref-test-1",
        autofocus: false,
      },
    ];

    // When creaing a RegisterList it should render the first input
    expect(wrapper.props("inputs").map(testableInputProps)).toStrictEqual(
      defaultInputs.map(testableInputProps),
    );
    // It should also render the contents inside a div with the name passed as a prop
    expect(wrapper.find("div.register-list-test").exists()).toBeTruthy();
  });

  it("fills inputs", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts value on the input. The input must contain the value matching the time mask
    const input = wrapper.get(".input-test-1 input");
    await input.setValue("0900");
    expect((input.element as any).value).toBe("09:00");
  });

  it("Adds another input when requested", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts a value on the first field. The add button should be visible only after
    // the field is filled
    expect(wrapper.find(".btn-test-1-add").exists()).toBeFalsy();
    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.find(".btn-test-1-add").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    // Triggers a click on the first field. The "click:add" event must be emitted
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click:add");

    // As the add button on the first input was click, two inputs should be visible
    expect(wrapper.find(".input-test-1 input").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
  });

  it("Adds another input on <enter>", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts a value on the first field. The add button should be visible only after
    // the field is filled
    expect(wrapper.find(".btn-test-1-add").exists()).toBeFalsy();
    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.find(".btn-test-1-add").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    // Triggers a <enter> keyup on the first field. The "click:add" event must be emitted
    await wrapper.get(".input-test-1 input").trigger("keyup.enter");
    expect(wrapper.emitted()).toHaveProperty("click:add");

    // As the add action was triggered on the first input was click, two inputs should be visible
    expect(wrapper.find(".input-test-1 input").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
  });

  it("Removes an input when requested", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts a value on the first field and triggers the addition of the second one. The second
    // input must be visible
    await wrapper.get(".input-test-1 input").setValue("0900");
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();

    // Triggers the deletion of the second input. It should not be visible after that
    await wrapper.get(".btn-test-2-remove").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click:remove");
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    // The remove button should not be visible on the first input
    expect(wrapper.find(".btn-test-1-remove").exists()).toBeFalsy();
  });

  it("Removes input on <esc> if valid", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts value on input. A new one should be visible and with a "remove" button
    await wrapper.get(".input-test-1 input").setValue("0943");
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.find(".btn-test-2-remove").exists()).toBeTruthy();

    // Presses <esc> on the second input. It should emit "click:remove" and disappear
    await wrapper.get(".input-test-2 input").trigger("keyup.esc");
    expect(wrapper.emitted("click:remove")?.length).toBe(1);
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    // Inserts value on the first input again. A new one with a remove button should be visible
    await wrapper.get(".input-test-1 input").setValue("1508");
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.find(".btn-test-2-remove").exists()).toBeTruthy();

    // Inserts value on the second input. A third one with a remove button should be visible
    await wrapper.get(".input-test-2 input").setValue("2045");
    await wrapper.get(".btn-test-2-add").trigger("click");
    expect(wrapper.find(".btn-test-3-remove").exists()).toBeTruthy();

    // Tries to trigger the deletion of the second one while the tird is visible
    // The second and third inputs should remain visible just like before
    await wrapper.get(".input-test-2 input").trigger("keyup.esc");
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-3 input").exists()).toBeTruthy();
    expect(wrapper.emitted("click:remove")?.length).toBe(1);

    // Triggers the deletion on the third input. Is should disappear and the "click:remove"
    // event must be emitted
    await wrapper.get(".input-test-3 input").trigger("keyup.esc");
    expect(wrapper.find(".input-test-3 input").exists()).toBeFalsy();
    expect(wrapper.emitted("click:remove")?.length).toBe(2);

    // Finally, triggers the keyup on the second input. It should be gone like the others
    await wrapper.get(".input-test-2 input").trigger("keyup.esc");
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();
    expect(wrapper.emitted("click:remove")?.length).toBe(3);

    // The remove button should not be visible or triggerable on the first input
    expect(wrapper.find(".btn-test-1-remove").exists()).toBeFalsy();
    await wrapper.get(".input-test-1 input").trigger("keyup.esc");
    expect(wrapper.emitted("click:remove")?.length).toBe(3);
    expect(wrapper.find(".input-test-1 input").exists()).toBeTruthy();
  });

  it("Adds on <enter> only if done on the last input", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts valid values for 4 inputs
    await wrapper.get(".input-test-1 input").setValue("0920");
    await wrapper.get(".btn-test-1-add").trigger("click");
    await wrapper.get(".input-test-2 input").setValue("1050");
    await wrapper.get(".btn-test-2-add").trigger("click");
    await wrapper.get(".input-test-3 input").setValue("1205");
    await wrapper.get(".btn-test-3-add").trigger("click");
    await wrapper.get(".input-test-4 input").setValue("1514");

    // Three add events should be triggered by now
    expect(wrapper.emitted("click:add")?.length).toBe(3);

    // Atempt to trigger the addition on the second input. The add action
    // should not be visble. The add button should only be available on the last input
    expect(wrapper.find(".btn-test-2-add").exists()).toBeFalsy();

    // The same is valid for the third and first inputs
    expect(wrapper.find(".btn-test-1-add").exists()).toBeFalsy();

    // The same applies to keyup events
    await wrapper.get(".input-test-3 input").trigger("keyup.enter");
    expect(wrapper.emitted("click:add")?.length).toBe(3);

    // Only on the fourth input (the last one) the add should be triggered
    await wrapper.get(".btn-test-4-add").trigger("click");
    expect(wrapper.emitted("click:add")?.length).toBe(4);
  });

  it("v-model props are syncing as expected", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    const expectedInputs = [
      {
        id: 1,
        value: "09:00",
        autofocus: false,
      },
      {
        id: 2,
        value: "12:00",
        autofocus: true,
      },
      {
        id: 3,
        value: undefined,
        autofocus: true,
      },
    ];

    // Inserts values for two inputs. The v-model prop should be equal as the
    // determined
    await wrapper.get(".input-test-1 input").setValue("0900");
    await wrapper.get(".btn-test-1-add").trigger("click");
    await wrapper.get(".input-test-2 input").setValue("1200");
    await wrapper.get(".btn-test-2-add").trigger("click");
    expect(wrapper.props("inputs").map(testableInputProps)).toStrictEqual(
      expectedInputs.map(testableInputProps),
    );
  });

  it("Validates input provided", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // The value "9999" is not valid because both minutes and seconds are greater
    // than 59
    await wrapper.get(".input-test-1 input").setValue("9999");
    expect(wrapper.props("inputs")[0].isValid()).toBeFalsy();

    // The value "0900" is valid
    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.props("inputs")[0].isValid()).toBeTruthy();

    // The value "99" is not valid. Valid values must have 4 digits
    await wrapper.get(".input-test-1 input").setValue("99");
    expect(wrapper.props("inputs")[0].isValid()).toBeFalsy();

    // The value "1259" is valid
    await wrapper.get(".input-test-1 input").setValue("1259");
    expect(wrapper.props("inputs")[0].isValid()).toBeTruthy();

    // Empty values are not valid
    await wrapper.get(".input-test-1 input").setValue("");
    expect(wrapper.props("inputs")[0].isValid()).toBeFalsy();

    // The value "2359" is valid
    await wrapper.get(".input-test-1 input").setValue("2359");
    expect(wrapper.props("inputs")[0].isValid()).toBeTruthy();

    // Inserts a valid value on the input and triggers the addition of another one
    // Inserts a lesser value on the second one. The second value is not valid
    await wrapper.get(".input-test-1 input").setValue("0900");
    await wrapper.get(".btn-test-1-add").trigger("click");
    await wrapper.get(".input-test-2 input").setValue("0859");
    expect(wrapper.props("inputs")[1].isValid()).toBeFalsy();

    // Changes the value of the second input to a greater value than the first
    // The second value must be valid now
    await wrapper.get(".input-test-2 input").setValue("0901");
    expect(wrapper.props("inputs")[1].isValid()).toBeTruthy();
  });

  it("Adds new inputs only if valid", async () => {
    const wrapper = mount(RegisterList, {
      global: {
        plugins: [Quasar],
      },
      props: {
        inputs: [],
        "onUpdate:inputs": (e: any[]) => wrapper.setProps({ inputs: e }),
        name: "test",
      },
    });

    // Inserts an invalid input on the first input. The add button should not
    // be clickable
    await wrapper.get(".input-test-1 input").setValue("9999");
    expect(wrapper.props("inputs")[0].isValid()).toBeFalsy();
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("click:add");

    // Inserts a valid input on the first input. The add button should now
    // be clickable
    await wrapper.get(".input-test-1 input").setValue("0102");
    expect(wrapper.props("inputs")[0].isValid()).toBeTruthy();
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted("click:add")?.length).toBe(1);

    // Removes the second input
    await wrapper.get(".btn-test-2-remove").trigger("click");

    // Inserts an invalid input on the first input again
    // The add action must not be clickable
    await wrapper.get(".input-test-1 input").setValue("1");
    expect(wrapper.props("inputs")[0].isValid()).toBeFalsy();
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted("click:add")?.length).toBe(1);

    // Changes the value on the first input to a valid one
    // The action must be clickable
    await wrapper.get(".input-test-1 input").setValue("1111");
    expect(wrapper.props("inputs")[0].isValid()).toBeTruthy();
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted("click:add")?.length).toBe(2);
  });
});
