/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DefineComponent } from 'vue';
import type { Plugin } from 'vue';

declare module 'vue' {
  export interface GlobalComponents {
    MaskNumber: DefineComponent<{
      placeholder: string;
      mask: string;
      value: string;
    }, {}, any>;
  }
}

export type MaskNumberRef = {
  element: HTMLDivElement | null;
  control: HTMLInputElement | null;
}

declare const plugin: Plugin;

export default plugin;
