import { mount } from '@vue/test-utils'
import {GlobalMountOptions} from "@vue/test-utils/dist/types";
import {Component, ComponentOptionsWithoutProps, VNode} from "vue";

type Slot = VNode | string | {
  render: Function;
} | Function | Component;

type SlotDictionary = {
  [key: string]: Slot;
};

interface MountingOptions<Props, Data = {}> {
  data?: () => {} extends Data ? any : Data extends object ? Partial<Data> : any;
  props?: Props;
  attrs?: Record<string, unknown>;
  slots?: SlotDictionary & {
    default?: Slot;
  };
  global?: GlobalMountOptions;
  attachTo?: HTMLElement | string;
  shallow?: boolean;
  component?: ComponentOptionsWithoutProps
}

export const mountComposition = <Props= {}>(callback: () => any, options: MountingOptions<never> = {}) => {
  let result: ReturnType<typeof callback>
  const { component, ...other }= options
  const Wrap = {
    template: '<div></div>',
    ...component,
    setup() {
      result = callback()
      return {
        result,
      }
    }
  }
  const vueWrapper = mount<Props>(Wrap, other);
  return Object.assign(vueWrapper, {result})
}
