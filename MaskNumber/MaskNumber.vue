<script setup lang="ts">
import { computed, ref, nextTick, toRefs } from 'vue';
import MaskNumberPlaceholder from './MaskNumberPlaceholder.vue';
import { getMaskedValue } from './utils';
import { controlMaskSymbol } from './values';

const props = withDefaults(
  defineProps<{
    autofocus?: boolean;
    disabled?: boolean;
    enterkeyhint?: 'enter'| 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | null | undefined;
    mask: string;
    placeholder: string;
    readonly?: boolean;
    required?: boolean;
    value: string;
  }>(),
  {
    autofocus: false,
    enterkeyhint: null,
    required: false,
    readonly: false,
    disabled: false,
  },
);

const {
  autofocus,
  disabled: isDisabled,
  readonly: isReadOnly,
  required: isRequired,
} = toRefs(props);

const emit = defineEmits<{
  (event: 'update:value', value: string): void;
}>();

const value = computed({
  get: () => getMaskedValue(props.value, props.mask),
  set: value => emit('update:value', value),
});

function handleKeyDown(event: KeyboardEvent) {
  const { target } = event;

  if (target instanceof HTMLInputElement && event.key === 'Backspace') {
    event.preventDefault();
    const { mask } = props;
    const { selectionStart, selectionEnd, value: inputValue } = target;

    if (
      selectionStart !== selectionEnd
      && typeof selectionStart === 'number'
      && typeof selectionEnd === 'number'
    ) {
      const count = Math.abs(selectionStart - selectionEnd);
      value.value = inputValue.slice(0, selectionStart)
        + controlMaskSymbol.repeat(count)
        + inputValue.slice(selectionEnd);

      return nextTick(() => {
        target.selectionStart = selectionStart;
        target.selectionEnd = selectionStart;
      });
    }

    const start = (selectionStart || mask.length) - 1;
    const index = props.mask.lastIndexOf(controlMaskSymbol, start);

    if (index !== -1) {
      value.value = inputValue.slice(0, index)
        + controlMaskSymbol
        + inputValue.slice(index + 1);

      nextTick(() => {
        const position = selectionStart ? selectionStart - 1 : 0;
        const nextPosition = props.mask.lastIndexOf(controlMaskSymbol, position);
        target.selectionStart = nextPosition;
        target.selectionEnd = nextPosition;
      });
    }
  }
}

function handleInput(event: Event) {
  nextTick(() => {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      target.value = value.value;
    }
  });
}

const containerElement = ref<HTMLElement | null>(null);
const inputControl = ref<HTMLInputElement | null>(null);

defineExpose({
  element: containerElement,
  control: inputControl,
});
</script>

<template>
  <div
    ref="containerElement"
    class="mask-number"
  >
    <MaskNumberPlaceholder
      :mask="mask"
      :placeholder="placeholder"
      :value="value"
    />

    <input
      ref="inputControl"
      v-model="value"
      autocomplete="off"
      :autofocus="autofocus"
      class="mask-number__control"
      :disabled="isDisabled"
      :enterkeyhint="enterkeyhint"
      inputmode="numeric"
      :readonly="isReadOnly"
      :required="isRequired"
      spellcheck="false"
      type="text"
      @input="handleInput"
      @keydown="handleKeyDown"
    >
  </div>
</template>

<style scoped lang="scss">
.mask-number {
  display: inline-block;
  position: relative;
  overflow: clip;
  text-align: left;
  padding: 0 !important;

  &__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: var(--mask-padding, 0);
    font: inherit;
    border: none;
    background: none;
    outline: none;
  }
}
</style>
