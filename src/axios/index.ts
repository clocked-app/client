import axios from "axios";
import { type App } from "vue";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export { http };

export default {
  install(app: App) {
    app.provide("http", http);
  },
};
