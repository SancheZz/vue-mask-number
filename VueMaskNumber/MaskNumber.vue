<template>
  <span
    :style="style"
    class="vue-mask-number"
  >
    <!-- control -->
    <input
      ref="input"
      v-model="inputValue"
      v-bind="$attrs"
      :maxlength="maxlength"
      type="text"
      inputmode="numeric"
      class="vue-mask-number__control"
      @focus="isFocusing = true"
      @blur="isFocusing = false"
    >

    <!-- mask -->
    <mask-placeholder
      :hidden="!isMaskShown"
      :mask="mask"
      :mask-character="maskCharacter"
      :value="maskValue"
      @update:value="handleMaskChange"
    ></mask-placeholder>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import MaskPlaceholder from './MaskNumberPlaceholder.vue';

import type Props from './props';

interface Style {
  [element: string]: string;
}

interface Controls {
  input: HTMLInputElement | undefined;
  maskWidth: number | undefined;
}

interface Provide {
  controls: Controls;
}

interface Data {
  controls: Controls;
  inputValue: string;
  maskValue: string;
  isFocusing: boolean;
}

interface Computed {
  isMaskShown: boolean;
  maxlength: number;
  style: Style;
}

interface Methods {
  handleMaskValueChange (value: string): void;
  handleMaskChange (value: string): void;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'MaskNumber',

  components: {
    MaskPlaceholder,
  },

  props: {
    mask: {
      type: String,
      default: '',
    },

    maskCharacter: {
      type: String,
      default: '0',
    },

    maskAlwaysVisible: {
      type: Boolean,
      default: false,
    },

    value: {
      type: String,
      default: undefined,
    },
  },

  data () {
    const controls = Vue.observable({
      input: undefined,
      maskWidth: undefined,
    });

    return {
      controls,
      inputValue: '',
      maskValue: '',
      isFocusing: false,
    };
  },

  computed: {
    isMaskShown () {
      return this.maskAlwaysVisible || this.isFocusing;
    },

    maxlength () {
      return this.mask.length;
    },

    style () {
      const { maskWidth } = this.controls;
      const style: Style = {};
      if (Number.isInteger(maskWidth)) {
        style.width = `${maskWidth}px`;
      }
      return style;
    },
  },

  provide (): Provide {
    return {
      controls: this.controls,
    };
  },

  watch: {
    inputValue: {
      immediate: true,
      handler (value: string): void {
        this.handleMaskValueChange(value);
        this.$nextTick(() => {
          if (this.value) {
            this.inputValue = this.value;
          }
        });
      },
    },

    value: {
      immediate: true,
      handler (value: string) {
        this.handleMaskValueChange(value);
        this.inputValue = value;
      },
    },
  },

  mounted () {
    this.controls.input = this.$refs.input as HTMLInputElement;
  },

  methods: {
    handleMaskValueChange (value) {
      this.maskValue = value;
    },

    handleMaskChange (validatedValue) {
      const { value } = this;
      if (value !== validatedValue) {
        this.$emit('update:value', validatedValue);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.vue-mask-number {
  position: relative;
  display: inline-block;
  padding: 0 !important;
  overflow: hidden;
  text-align: left;

  &__control {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: 100%;
    margin: 0 !important;
    padding: var(--mask-padding, 0);
    color: currentColor;
    font: inherit;
    background: none;
    border: none;
    outline: none; // you have to use :focus-within in a parent component
  }
}
</style>
