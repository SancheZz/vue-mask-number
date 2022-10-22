# @yasanchezz/vue-mask-number

> This is an input mask which is based on VueJs 3.2+ and requires modern browsers.

## Installation

Install npm package
`npm install @yasanchezz/vue-mask-number --save-dev`

Declare dependency in main.js

``` js
import MaskNumber from '@yasanchezz/vue-mask-number';
import '@yasanchezz/vue-mask-number/dist/style.css';

createApp(App)
  .use(MaskNumber)
  .mount('#app');
```

## Usage

``` vue
<template>
  <MaskNumber
    v-model:value="value"
    mask="+47 ### ## ###"
    placeholder="+47 123 45 678"
  />
</template>

<style lang="scss" scoped>
.mask-number {
  --mask-padding: 5px 10px;
  --mask-placeholder-color: pink;

  border: 2px solid black;
  border-radius: 4px;
  transition: border-color .1s ease-out;

  /* yeap, input has no styles itself, you have to style it */
  &:focus-within {
    border-color: blue;
  }
}
</style>
```

### props
* __mask__ *String* - mask with `#` character, for example, +47 ### ## ###;
* __placeholder__ *String* - placeholder string, which is showing;
* __value__ *String* - passed value;
* __required__: *Boolean?* - native attribute;
* __readonly__: *Boolean?* - native attribute;
* __disabled__: *Boolean?* - native attribute;

### Usage as Ref
You can use inner elements:

* __element__ *HTMLDivElement* - component container
* __control__ *HTMLInputElement* - controls itself. You can use a control to handle events, e.g. invalid.

``` js
import { ref, watch } from 'vue'
import { type MaskNumberRef } from '@yasanchezz/vue-mask-number'

const mask = ref<MaskNumberRef | null> = ref(null);

watch(
  () => mask.value?.control,
  control => {
    if (control) {
      control.addEventListener('invalid', event => {
        // handle invalid event
      })
    }
  }
)
```

and you have to define the ref attribute
``` vue
<template>
  <MaskNumber
    ref="mask"
  />
</template>
```
