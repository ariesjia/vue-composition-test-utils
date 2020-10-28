import { ref } from 'vue'
import { mountComposition, nextTick } from "../index";

function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const inc = (delta = 1) => (count.value += delta)
  return { count, inc }
}

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
