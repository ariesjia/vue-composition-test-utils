import { mountComposition } from "../index";
import { ref, nextTick } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const inc = (delta = 1) => (count.value += delta)
  return { count, inc }
}

test('should get current composition result', function() {
  const wrapper = mountComposition(useCounter)
  expect(wrapper.result.count.value).toEqual(0)
});


test('should get current value when trigger method', function() {
  const wrapper = mountComposition(()=>useCounter(1))
  expect(wrapper.result.count.value).toEqual(1)
  wrapper.result.inc()
  expect(wrapper.result.count.value).toEqual(2)
});

test('should render template', async function() {
  const wrapper = mountComposition(useCounter, {
    component: {
      render({ result}) {
        return `hello world ${result.count.value}`
      }
    }
  })
  expect(wrapper.html()).toEqual('hello world 0')
  await nextTick(() => {
    wrapper.result.inc()
  })
  expect(wrapper.result.count.value).toEqual(1)
  expect(wrapper.html()).toEqual('hello world 1')
});
