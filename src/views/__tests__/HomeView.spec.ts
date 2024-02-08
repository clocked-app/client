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

    // On render, the contents should be inside a div with a classe name based
    // on the name prop
    expect(wrapper.find("div.home-view-test").exists()).toBeTruthy();

    // It should be visible a version element with the app version
    expect(wrapper.get(".version").text()).toMatch(/v(\d+\.)(\d+\.)(\*|\d+)/);

    // It should render a list title with the appropriate name
    expect(wrapper.get(".worker-list .list-title").text()).toBe(
      "Worker records",
    );

    // It should render a list title with the appropriate name
    expect(wrapper.get(".shift-list .list-title").text()).toBe(
      "Shift records",
    );

    // It should render the worker record list component
    expect(wrapper.find("div.record-list-worker").exists()).toBeTruthy();

    // It should render the shift record list component
    expect(wrapper.find("div.record-list-shift").exists()).toBeTruthy();

    // A confirm button must be visible
    expect(wrapper.find("button.confirm").exists()).toBeTruthy();
  });

  it("confirm button reads all records", async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [Quasar],
      },
      props: {},
    });

    // Inserts two records on the worker list
    await wrapper.get(".input-worker-1 input").setValue("0905");
    await wrapper.get(".btn-worker-1-add").trigger("click");
    await wrapper.get(".input-worker-2 input").setValue("1205");

    // Insert one record on the worker list
    await wrapper.get(".input-shift-1 input").setValue("0900");

    // Triggers the click on the confirm button. The event "onConfirm" should
    // be emmited
    await wrapper.get("button.confirm").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("onConfirm");
    expect(wrapper.emitted().onConfirm.length).toBe(1);

    // Assures that the records passed as arguments on the event have
    // the expected quantity of data
    const clickEventParams = wrapper.emitted().onConfirm[0] as Array<
      typeof OnConfirmEvtParam
    >;
    expect(clickEventParams[0]).toHaveProperty("workerInputs");
    expect(clickEventParams[0].workerInputs.length).toBe(2);
    expect(clickEventParams[0]).toHaveProperty("shiftInputs");
    expect(clickEventParams[0].shiftInputs.length).toBe(1);
  });
});
