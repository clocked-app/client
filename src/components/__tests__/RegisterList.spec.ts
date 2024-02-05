import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import RegisterList from "../RegisterList.vue";

import { Quasar } from "quasar";

describe("RegisterList", () => {
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

    expect(wrapper.props("inputs").map(testableInputProps)).toStrictEqual(
      defaultInputs.map(testableInputProps),
    );
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

    expect(wrapper.find(".btn-test-1-add").exists()).toBeFalsy();
    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.find(".btn-test-1-add").exists()).toBeTruthy();

    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click:add");

    expect(wrapper.find(".input-test-1 input").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
  });

  it("Adds another input with enter", async () => {
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

    expect(wrapper.find(".btn-test-1-add").exists()).toBeFalsy();
    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.find(".btn-test-1-add").exists()).toBeTruthy();

    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    await wrapper.get(".input-test-1 input").trigger("keypress.enter");
    expect(wrapper.emitted()).toHaveProperty("click:add");

    expect(wrapper.find(".input-test-1 input").exists()).toBeTruthy();
    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
  });

  it("Removes another input when requested", async () => {
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

    await wrapper.get(".input-test-1 input").setValue("0900");
    await wrapper.get(".btn-test-1-add").trigger("click");

    expect(wrapper.find(".input-test-2 input").exists()).toBeTruthy();
    await wrapper.get(".btn-test-2-remove").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click:remove");
    expect(wrapper.find(".input-test-2 input").exists()).toBeFalsy();

    expect(wrapper.find(".btn-test-1-remove").exists()).toBeFalsy();
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

    await wrapper.get(".input-test-1 input").setValue("9999");
    expect(wrapper.props('inputs')[0].isValid()).toBeFalsy()

    await wrapper.get(".input-test-1 input").setValue("0900");
    expect(wrapper.props('inputs')[0].isValid()).toBeTruthy()

    await wrapper.get(".input-test-1 input").setValue("99");
    expect(wrapper.props('inputs')[0].isValid()).toBeFalsy()

    await wrapper.get(".input-test-1 input").setValue("1259");
    expect(wrapper.props('inputs')[0].isValid()).toBeTruthy()

    await wrapper.get(".input-test-1 input").setValue("");
    expect(wrapper.props('inputs')[0].isValid()).toBeFalsy()

    await wrapper.get(".input-test-1 input").setValue("2359");
    expect(wrapper.props('inputs')[0].isValid()).toBeTruthy()
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

    await wrapper.get(".input-test-1 input").setValue("9999");
    expect(wrapper.props('inputs')[0].isValid()).toBeFalsy()
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("click:add");

    await wrapper.get(".input-test-1 input").setValue("0102");
    expect(wrapper.props('inputs')[0].isValid()).toBeTruthy()
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted('click:add')?.length).toBe(1);

    await wrapper.get(".btn-test-2-remove").trigger("click");

    await wrapper.get(".input-test-1 input").setValue("1");
    expect(wrapper.props('inputs')[0].isValid()).toBeFalsy()
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted('click:add')?.length).toBe(1);

    await wrapper.get(".input-test-1 input").setValue("1111");
    expect(wrapper.props('inputs')[0].isValid()).toBeTruthy()
    await wrapper.get(".btn-test-1-add").trigger("click");
    expect(wrapper.emitted('click:add')?.length).toBe(2);
  });
});
