# vue-composition-test-utils
Simple vue composition api testing utilities

[![Actions Status](https://github.com/ariesjia/vue-composition-test-utils/workflows/Node%20CI/badge.svg)](https://github.com/ariesjia/vue-composition-test-utils/actions)
[![NPM](https://img.shields.io/npm/v/vue-composition-test-utils.svg)](https://www.npmjs.com/package/vue-composition-test-utils)
[![license](https://badgen.net/badge/license/MIT/blue)](https://github.com/ariesjia/vue-composition-test-utils/blob/master/LICENSE)


## Install
```bash
// use yarn
yarn add vue-composition-test-utils -D
// use npm
npm install vue-composition-test-utils -D
```

## Demo

#### Code

```js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const inc = (delta = 1) => (count.value += delta)
  return { count, inc }
}
```

#### Test

```js
import { mountComposition, nextTick } from 'vue-composition-test-utils'

test('should get current composition result', function() {
  const wrapper = mountComposition(useCounter)
  expect(wrapper.result.current.count.value).toEqual(0)
});

test('should get current value when trigger method', function() {
  const wrapper = mountComposition(()=>useCounter(1))
  expect(wrapper.result.current.count.value).toEqual(1)
  wrapper.result.current.inc()
  expect(wrapper.result.current.count.value).toEqual(2)
});

test('should render template though template option', async function() {
  const wrapper = mountComposition(useCounter, {
    component: {
      template: 'hello world {{result.current.count.value}}',
    }
  })
  expect(wrapper.html()).toEqual('hello world 0')
  await nextTick(() => {
    wrapper.result.current.inc()
  })
  expect(wrapper.html()).toEqual('hello world 1')
});

test('should render template though render option', async function() {
  const wrapper = mountComposition(useCounter, {
    component: {
      render({ result}) {
        return `hello world ${result.current.count.value}`
      }
    }
  })
  expect(wrapper.html()).toEqual('hello world 0')
  await nextTick(() => {
    wrapper.result.current.inc()
  })
  expect(wrapper.html()).toEqual('hello world 1')
});
```

## API

```typescript
import {GlobalMountOptions} from "@vue/test-utils/dist/types";
import {ComponentOptionsWithoutProps} from "vue";

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
}

interface MountingResult<R> {
    current: R | null;
    error: Error | null;
}

export declare const mountComposition: <R, Props>(callback: () => R, options?: MountingOptions<never>) => import("@vue/test-utils").VueWrapper<import("vue").ComponentPublicInstance<Props, {}, {}, {}, {}, Record<string, any>, import("vue").VNodeProps & Props, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>>> & {
    result: MountingResult<R>;
};

export const nextTick: (fn?: () => void) => Promise<void>
```
