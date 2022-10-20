<script setup lang="ts">
import MaskNumberPlaceholderSymbol from './MaskNumberPlaceholderSymbol.vue';

defineProps<{
  mask: string;
  placeholder: string;
  value: string;
}>();
</script>

<template>
  <div class="number-placeholder">
    <MaskNumberPlaceholderSymbol
      v-for="(symbol, index) in placeholder"
      :key="index"
      :hidden="Boolean(value[index])"
      :symbol="symbol"
    />
  </div>
</template>

<style scoped lang="scss">
.number-placeholder {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font: inherit;
  pointer-events: none;
  color: var(--mask-placeholder-color, inherit);
  padding: var(--mask-padding, 0);
}
</style>
