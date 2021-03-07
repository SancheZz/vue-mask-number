<template>
  <div>
    <mask-number
      class="input"
      data-playwright="defaults"
      mask="+47 1 first numbers ####  second numbers ####"
      :value.sync="value"
    ></mask-number>

    <mask-number
      class="input"
      data-playwright="mask-always-visible"
      mask="+47 1 first numbers ####  second numbers ####"
      mask-always-visible
      :value.sync="value"
    ></mask-number>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MaskNumber from '../VueMaskNumber/MaskNumber.vue';

export default Vue.extend({
  name: 'App',

  components: {
    MaskNumber,
  },

  data () {
    return {
      value: undefined,
    };
  },
});
</script>

<style lang="scss" scoped>
.input {
  --mask-padding: 5px 10px;
  --mask-controlled-color: pink;
  --mask-uncontrolled-color: gray;

  display: block;
  margin: 10px 0;
  border: 2px solid black;
  border-radius: 4px;
  transition: border-color 0.1s ease-out;

  &:focus-within {
    border-color: blue;
  }
}
</style>
