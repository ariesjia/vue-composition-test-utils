import * as TestUils from '@vue/test-utils'
import {GlobalMountOptions} from "@vue/test-utils/dist/types";
import {Component, ComponentOptionsWithoutProps, VNode} from "vue";
import VueCompositionApi from '@vue/composition-api'
export { nextTick } from 'vue-demi'

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
  component?: ComponentOptionsWithoutProps;
  localVue?: any;
}

interface MountingResult<R> {
  current: R | null,
  error: Error | null
}

export const mountComposition = <R, Props>(callback: () => R, options: MountingOptions<never> = {}) => {
  let result: MountingResult<R>
  const { component, localVue, ...other }= options
  const Wrap = {
    template: '<div></div>',
    ...component,
    setup() {
      try {
        result = {
          current: callback(),
          error: null
        }
      }catch (e) {
        result = {
          current: null,
          error: e
        }
      }
      return {
        result ,
      }
    }
  }

  // @ts-ignore
  let createLocalVue = TestUils.createLocalVue;
  let globalLocalVue
  if(createLocalVue) {
    globalLocalVue = localVue ? localVue : createLocalVue();
    globalLocalVue.use(VueCompositionApi)
  }

  // @ts-ignore
  const vueWrapper = TestUils.mount<Props>(Wrap, {
    ...other,
    localVue: globalLocalVue,
  });

  return Object.assign(vueWrapper, {result})
}
