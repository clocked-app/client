import { mount } from "@vue/test-utils";
import router from "../../router";
import { describe, expect, it } from "vitest";
import App from "../../App.vue";
import { Quasar } from "quasar";

describe("routing", async () => {
  it("renders the home view as the root route", async () => {
    router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    // Assures that the component HomeView is rendered as the root route
    expect(wrapper.find("div.home-view-main").exists()).toBeTruthy();
  });
});
