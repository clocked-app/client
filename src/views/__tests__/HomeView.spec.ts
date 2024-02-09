import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import HomeView from "../HomeView.vue";
import OnConfirmEvtParam from "../HomeView.vue";
import { type Calculation } from "../../controller/CalculationController";
import { http } from "../../axios";
import { format } from "date-fns";

// Defines requests mock
vi.mock("../../axios", async (importOriginal: any) => {
  return {
    ...(await importOriginal()),
    http: {
      post: async (): Promise<{ data: Calculation[] }> => {
        return {
          data: [
            {
              type: "WORK",
              value: 8,
            },
            {
              type: "ABSENT",
              value: 1,
            },
          ],
        };
      },
    },
  };
});

describe("HomeView", () => {
  it("renders properly", async () => {
    const wrapper = mount(HomeView, {
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
    expect(wrapper.get(".registered-list .list-title").text()).toBe(
      "Registered records",
    );

    // It should render a list title with the appropriate name
    expect(wrapper.get(".shift-list .list-title").text()).toBe("Shift records");

    // It should render the registered record list component
    expect(wrapper.find("div.record-list-registered").exists()).toBeTruthy();

    // It should render the shift record list component
    expect(wrapper.find("div.record-list-shift").exists()).toBeTruthy();

    // A confirm button must be visible
    expect(wrapper.find("button.confirm").exists()).toBeTruthy();
  });

  it("confirm button reads all records", async () => {
    const wrapper = mount(HomeView, {
      props: {},
    });

    // Inserts two records on the registered list
    await wrapper.get(".input-registered-1 input").setValue("0905");
    await wrapper.get(".btn-registered-1-add").trigger("click");
    await wrapper.get(".input-registered-2 input").setValue("1205");

    // Insert one record on the registered list
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
    expect(clickEventParams[0]).toHaveProperty("registeredInputs");
    expect(clickEventParams[0].registeredInputs.length).toBe(2);
    expect(clickEventParams[0]).toHaveProperty("shiftInputs");
    expect(clickEventParams[0].shiftInputs.length).toBe(1);
  });

  it("confirm button requests and displays calculations", async () => {
    const wrapper = mount(HomeView, {
      props: {},
    });

    const spy = vi.spyOn(wrapper.vm.$q, "dialog");

    // Inserts two records on the registered list
    await wrapper.get(".input-registered-1 input").setValue("0900");
    await wrapper.get(".btn-registered-1-add").trigger("click");
    await wrapper.get(".input-registered-2 input").setValue("0910");

    // Inserts two records on the shift list
    await wrapper.get(".input-shift-1 input").setValue("0900");
    await wrapper.get(".btn-shift-1-add").trigger("click");
    await wrapper.get(".input-shift-2 input").setValue("0930");

    // Triggers confirm button click
    await wrapper.find("button.confirm").trigger("click");

    // It should render a dialog with a message and a title
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({
      title: "Calculation Results",
      message: "<i>Work Time:</i> 8<br><i>Absent Time:</i> 1",
      html: true,
      class: "calculation-dialog",
    });
  });

  it("confirm button requests to expected endpoint", async () => {
    const wrapper = mount(HomeView, {
      props: {},
    });

    // Override http mock to test endpoint calls
    const spy = vi.spyOn(http, "post").mockImplementation(async () => {
      return {
        data: [],
      };
    });

    const date = format(new Date(), "yyyy-MM-dd");

    // Inserts two records on the registered list
    await wrapper.get(".input-registered-1 input").setValue("0900");
    await wrapper.get(".btn-registered-1-add").trigger("click");
    await wrapper.get(".input-registered-2 input").setValue("0910");

    // Inserts two records on the shift list
    await wrapper.get(".input-shift-1 input").setValue("0900");
    await wrapper.get(".btn-shift-1-add").trigger("click");
    await wrapper.get(".input-shift-2 input").setValue("0930");

    // Triggers confirm button click
    await wrapper.find("button.confirm").trigger("click");

    // It should call a specific endpoint with matching input's data
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith("/calculations/day", {
      date,
      registeredRecords: [`${date} 09:00`, `${date} 09:10`],
      shiftRecords: [`${date} 09:00`, `${date} 09:30`],
    });
  });
});
