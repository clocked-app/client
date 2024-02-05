import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import HomeView from "../HomeView.vue";
import OnConfirmEvtParam from "../HomeView.vue";

import { Quasar } from "quasar";

describe("HomeView", () => {
  it("renders properly", async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [Quasar],
      },
      props: {
        name: "test",
      },
    });

    expect(wrapper.find("div.home-view-test").exists()).toBeTruthy();
    expect(wrapper.get(".version").text()).toMatch(/v(\d+\.)(\d+\.)(\*|\d+)/);
    expect(wrapper.get(".worker-list .list-title").text()).toBe(
      "Worker registers",
    );
    expect(wrapper.get(".shift-list .list-title").text()).toBe(
      "Shift registers",
    );
    expect(wrapper.find("div.register-list-worker").exists()).toBeTruthy();
    expect(wrapper.find("div.register-list-shift").exists()).toBeTruthy();
    expect(wrapper.find("button.confirm").exists()).toBeTruthy();
  });

  it("confirm button reads all registers", async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [Quasar],
      },
      props: {},
    });

    await wrapper.get(".input-worker-1 input").setValue("0905");
    await wrapper.get(".btn-worker-1-add").trigger("click");
    await wrapper.get(".input-worker-2 input").setValue("1205");

    await wrapper.get(".input-shift-1 input").setValue("0900");

    await wrapper.get("button.confirm").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("onConfirm");
    expect(wrapper.emitted().onConfirm.length).toBe(1);

    const clickEventParams = wrapper.emitted().onConfirm[0] as Array<
      typeof OnConfirmEvtParam
    >;
    expect(clickEventParams[0]).toHaveProperty("workerInputs");
    expect(clickEventParams[0].workerInputs.length).toBe(2);
    expect(clickEventParams[0]).toHaveProperty("shiftInputs");
    expect(clickEventParams[0].shiftInputs.length).toBe(1);
  });
});
