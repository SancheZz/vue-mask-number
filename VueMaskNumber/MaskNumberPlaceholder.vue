<template>
  <span :class="classes">
    <span
      v-for="(character, index) in normalizedMask"
      :key="index"
      :class="getCharacterClasses(character, index)"
    >{{ character }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import type { VueConstructor } from 'vue';

import {
  extractValue,
  getCaretPosition,
  mapValueOnMask,
  validateValue,
} from './MaskNumberUtils';

interface Props {
  hidden: boolean;
  mask: string;
  maskCharacter: string;
  value: string | undefined;
}

interface Inject {
  controls: {
    input: HTMLInputElement | undefined;
    maskWidth: number | undefined;
  };
}

interface Data {
  resizeObserver: ResizeObserver | undefined;
}

interface Computed {
  classes: {
    [element: string]: boolean;
  };
  validatedValue: string;
  mappedMask: string;
  normalizedMask: string;
  maskedValue: string;
  unremovableMask: string;
}

interface Methods {
  getCharacterClasses (character: string, index: number): void;
  addInputListeners (input: HTMLInputElement): void;
  removeInputListeners (input: HTMLInputElement): void;
  handleKeyDown (event: KeyboardEvent): void;
  handleElementResize (entries: ResizeObserverEntry[]): void;
  handleWindowResize (): void;
}

const CONTROL_CHARACTER = '#';
const controlCharacterPattern = new RegExp(CONTROL_CHARACTER, 'g');

const VueComponent = Vue as VueConstructor<Vue & Inject>;

export default VueComponent.extend<Data, Methods, Computed, Props>({
  name: 'MaskNumberPlaceholder',

  inject: ['controls'],

  props: {
    hidden: {
      type: Boolean,
      default: false,
    },

    // mask may include control characters lattice for inserting user input
    mask: {
      type: String,
      required: true,
    },

    // character which can replace control character
    maskCharacter: {
      type: String,
      default: '0',
    },

    // user input
    value: {
      type: String,
      default: undefined,
    },
  },

  data () {
    return {
      resizeObserver: undefined,
    };
  },

  computed: {
    classes () {
      const cssClassName = 'mask-placeholder';
      return {
        [cssClassName]: true,
        [`${cssClassName}--hidden`]: this.hidden,
      };
    },

    validatedValue () {
      const { value, mask } = this;
      return validateValue(value, mask);
    },

    mappedMask () {
      const { validatedValue, mask } = this;
      return mapValueOnMask(validatedValue, mask);
    },

    normalizedMask () {
      const { mappedMask, maskCharacter } = this;
      return mappedMask.replace(controlCharacterPattern, maskCharacter);
    },

    maskedValue () {
      return extractValue(this.mappedMask);
    },

    unremovableMask () {
      const nonmaskPattern = /\D+$/;
      return this.mask.replace(nonmaskPattern, '');
    },
  },

  watch: {
    maskedValue: {
      immediate: true,
      async handler (value: string, oldValue?: string) {
        this.$emit('update:value', value);
        const { input } = this.controls;
        if (input) {
          const selectionStart = input.selectionStart as number;
          const caretPosition = getCaretPosition(value, oldValue, selectionStart);
          await this.$nextTick();
          input.setSelectionRange(caretPosition, caretPosition);
        }
      },
    },

    'controls.input': function (newRef: HTMLInputElement, oldRef?: HTMLInputElement) {
      if (newRef && !oldRef) {
        this.addInputListeners(newRef);
      }
      if (!newRef && oldRef) {
        this.removeInputListeners(oldRef);
      }
    },
  },

  mounted () {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this.handleElementResize);
      this.resizeObserver.observe(this.$el);
    } else {
      this.handleWindowResize();
      window.addEventListener('resize', this.handleWindowResize);
    }
  },

  beforeDestroy () {
    if (this.controls.input instanceof HTMLInputElement) {
      this.removeInputListeners(this.controls.input);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('reisze', this.handleWindowResize);
    }
  },

  methods: {
    getCharacterClasses (character, index) {
      const { length } = this.maskedValue;
      const isNumberPattern = /\d/;
      const cssClassName = 'mask-character';
      return {
        [cssClassName]: true,
        [`${cssClassName}--hidden`]: index < length,
        [`${cssClassName}--controlled`]: isNumberPattern.test(character),
      };
    },

    addInputListeners (input) {
      input.addEventListener('keydown', this.handleKeyDown);
    },

    removeInputListeners (input) {
      input.removeEventListener('keydown', this.handleKeyDown);
    },

    // set caret on previous character when removing character is nondigital
    handleKeyDown (event) {
      const { maskedValue, unremovableMask } = this;
      const { key } = event;

      const input = event.target as HTMLInputElement;
      const selectionStart = input.selectionStart as number;
      const selectionEnd = input.selectionEnd as number;

      const lastNumberPattern = /\D+$/;
      const possibleCaretPosition = maskedValue
        .slice(0, selectionStart || 0)
        .search(lastNumberPattern);

      const isKeyBackspace = key === 'Backspace';
      const isRangeSame = selectionStart === selectionEnd;
      const hasPrevPosition = possibleCaretPosition !== -1;

      if (isKeyBackspace && isRangeSame && hasPrevPosition) {
        input.setSelectionRange(possibleCaretPosition, possibleCaretPosition);
      }

      const unremovableMaskLength = unremovableMask.length;
      const isMaskEnd = unremovableMaskLength >= selectionStart
        || unremovableMaskLength === possibleCaretPosition;

      if (isKeyBackspace && isRangeSame && isMaskEnd) {
        event.preventDefault();
        input.setSelectionRange(unremovableMaskLength, unremovableMaskLength);
      }
    },

    handleElementResize (entries) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const maskContainer = entries[0]!.target as HTMLElement;
      this.controls.maskWidth = Math.ceil(maskContainer.offsetWidth);
    },

    handleWindowResize () {
      const maskContainer = this.$el as HTMLElement;
      this.controls.maskWidth = Math.ceil(maskContainer.offsetWidth);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./defaults.scss";

.mask-placeholder {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  padding: var(--mask-padding, 0);
  color: $maskUncontrolledColor;
  color: var(--mask-uncontrolled-color, $maskUncontrolledColor);
  font: inherit;
  white-space: pre;

  &--hidden {
    visibility: hidden;
  }
}

.mask-character {
  &--controlled {
    color: $maskControlledColor;
    color: var(--mask-controlled-color, $maskControlledColor);
  }

  &--hidden {
    visibility: hidden;
  }
}
</style>
