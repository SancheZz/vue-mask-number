import VueMaskNumber from './MaskNumber.vue';

export {
  VueMaskNumber,
};

export default Object.assign(VueMaskNumber, {
  install (Vue) {
    Vue.component('vue-mask-number', VueMaskNumber);
  },
});
