import { describe, it, expect, vi } from "vitest";
import { buildInstance } from "../index";
import axios from "axios";

describe("Axios-http module", async () => {
  it("requests environment vars in production mode", async () => {
    const spyGet = vi.spyOn(axios, "get").mockImplementation(async () => {
      return {
        data: {
          VITE_API_URL: "http://some-url.com",
        },
      };
    });

    const spyCreate = vi.spyOn(axios, "create");

    await buildInstance('production');
    expect(spyGet).toBeCalledTimes(1);
    expect(spyGet).toBeCalledWith("/env");
    expect(spyCreate).toBeCalledTimes(1);
    expect(spyCreate).toBeCalledWith({
      baseURL: "http://some-url.com"
    });
  });

  it("sets the environment var as the uri in development mode", async () => {
    const spyCreate = vi.spyOn(axios, "create");

    await buildInstance('development');
    expect(spyCreate).toBeCalledTimes(1);
    expect(spyCreate).toBeCalledWith({
      baseURL: import.meta.env.VITE_API_URL
    });
  });

  it("sets the environment var as the uri in gh-pages mode", async () => {
    const spyCreate = vi.spyOn(axios, "create");

    await buildInstance('gh-pages');
    expect(spyCreate).toBeCalledTimes(1);
    expect(spyCreate).toBeCalledWith({
      baseURL: import.meta.env.VITE_API_URL
    });
  });
});
