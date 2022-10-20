<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  symbol: string;
  hidden: boolean;
}>();

const classes = computed(() => {
  const cssClassName = 'placeholder-symbol';
  return {
    [cssClassName]: true,
    [`${cssClassName}--hidden`]: props.hidden,
  };
});
</script>

<template>
  <span :class="classes">{{ symbol }}</span>
</template>

<style scoped lang="scss">
.placeholder-symbol {

  &--hidden {
    visibility: hidden;
  }
}
</style>
