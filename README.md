# @yasanchezz/vue-mask-number

> This is a input mask which is based on VueJs 2.6+ and requires modern browsers.
> [Live Demo](http://sanchezz.me/vuemasknumber/).

## Installation

Install npm package
`npm install @yasanchezz/vue-mask-number --save-dev`

Declare dependency in main.js

``` js
import VueMaskNumber from '@yasanchezz/vue-mask-number';
import '@yasanchezz/vue-mask-number/dist/vue-mask-number.css';
Vue.use(VueMask);
```

## Usage

``` vue
<template>
  <vue-mask
    :value.sync="value"
    mask="+47 ### ## ###"
    mask-character="0"
    class="mask-number"
    always-visible-mask
  ></vue-mask>
</template>

<style lang="scss" scoped>
.mask-number {
  /* padding for input and mask */
  --mask-padding: 5px 10px;

  /* mask controlled character which was passed by mask-character prop */
  --mask-controlled-color: pink;

  /* mask uncontrolled character does not look like a controllable */
  --mask-uncontrolled-color: gray;

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
* __mask__ *String* - mask with `#` character, for example, +47 ### ## ###
* __mask-character__ *String* - one symbol which will replace controlled character `#` in the mask
* __value__ *String* - passed value
* __always-visible-mask__ *Boolean* - indicates to show mask all time. By default is false and the mask will be shown when input is focused
