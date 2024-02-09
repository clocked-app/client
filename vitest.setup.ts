import { config } from '@vue/test-utils';
import { Quasar, Dialog } from "quasar";

config.global.plugins = [
  [Quasar, {
    config: {
      dark: true,
    },
    plugins: {
      Dialog,
    },
  }]
];
