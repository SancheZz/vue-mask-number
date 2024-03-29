/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { DefineComponent } from 'vue';
import type { Plugin } from 'vue';

declare module 'vue' {
  export interface GlobalComponents {
    MaskNumber: DefineComponent<{
      autofocus?: boolean;
      disabled?: boolean;
      enterkeyhint?: 'enter'| 'done'| 'go'| 'next'| 'previous'| 'search'| 'send' | null | undefined;
      mask: string;
      name?: string;
      placeholder: string;
      readonly?: boolean;
      required?: boolean;
      value: string;
    }, {}, any>;
  }
}

export type MaskNumberRef = {
  control: HTMLInputElement | null;
  element: HTMLDivElement | null;
}

declare const plugin: Plugin;

export default plugin;
