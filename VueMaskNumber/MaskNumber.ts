import MaskNumber from './MaskNumber.vue';

import type { PluginObject, VueConstructor } from 'vue';

export {
  MaskNumber,
};

export default {
  install (Vue: VueConstructor) {
    Vue.component('vue-mask-number', MaskNumber);
  },
} as PluginObject<unknown>;
