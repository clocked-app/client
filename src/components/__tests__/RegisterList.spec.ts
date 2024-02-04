import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import RegisterList from "../RegisterList.vue";

import { Quasar } from "quasar";

describe("RegisterList", () => {
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

    expect(wrapper.props("inputs")).toStrictEqual(defaultInputs);
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
        ref: "ref-test-1",
        autofocus: false,
      },
      {
        id: 2,
        value: "12:00",
        ref: "ref-test-2",
        autofocus: true,
      },
      {
        id: 3,
        value: undefined,
        ref: "ref-test-3",
        autofocus: true,
      },
    ];

    await wrapper.get(".input-test-1 input").setValue("0900");
    await wrapper.get(".btn-test-1-add").trigger("click");
    await wrapper.get(".input-test-2 input").setValue("1200");
    await wrapper.get(".btn-test-2-add").trigger("click");
    expect(wrapper.props("inputs")).toStrictEqual(expectedInputs);
  });
});
