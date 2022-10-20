import MaskNumber from './MaskNumber.vue';
import { type App } from 'vue';

export default {
  install(app: App) {
    app.component('MaskNumber', MaskNumber);
  },
};
