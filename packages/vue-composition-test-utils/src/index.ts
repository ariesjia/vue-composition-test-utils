import { mount } from '@vue/test-utils'
// @ts-ignore
import { nextTick as tick } from 'vue-demi'

interface MountingOptions<Props, Data = {}> {
  data?: () => {} extends Data ? any : Data extends object ? Partial<Data> : any;
  props?: Props;
  attrs?: Record<string, unknown>;
  slots?: any;
  global?: any;
  attachTo?: HTMLElement | string;
  shallow?: boolean;
  component?: any;
  localVue?: any;
}

interface MountingResult<R> {
  current: R | null,
  error: Error | null
}

export const mountComposition = <R, Props>(callback: () => R, options: MountingOptions<never> = {}) => {
  let result: MountingResult<R>
  const { component = {}, ...other }= options
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

  const vueWrapper = mount(Wrap, other);

  return Object.assign(vueWrapper, {result})
}

export const nextTick = async (callback) => {
  callback && callback()
  await tick();
}
