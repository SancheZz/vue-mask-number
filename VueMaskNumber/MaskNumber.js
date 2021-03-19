import MaskNumber from './MaskNumber.vue';

export {
  MaskNumber,
};

export default Object.assign(MaskNumber, {
  install (Vue) {
    Vue.component('vue-mask-number', MaskNumber);
  },
});
