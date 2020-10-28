const {ref} = require('@vue/composition-api')
const {createLocalVue} = require('@vue/test-utils')
const {mountComposition, nextTick} = require('vue-composition-test-utils')

function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const inc = (delta = 1) => (count.value += delta)
  return { count, inc }
}

test('should get current composition result', function() {
  const localVue =createLocalVue()
  const wrapper = mountComposition(useCounter, {localVue})
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
      template: '<span>hello world {{result.current.count.value}}</span>',
    }
  })
  expect(wrapper.html()).toEqual('<span>hello world 0</span>')
  wrapper.result.current.inc()
  await nextTick()
  expect(wrapper.html()).toEqual('<span>hello world 1</span>')
});

test('should render template though render option', async function() {
  const wrapper = mountComposition(useCounter, {
    component: {
      render(h) {
        return h('span', {}, [
          `hello world ${this.result.current.count.value}`
        ])
      }
    }
  })
  expect(wrapper.html()).toEqual('<span>hello world 0</span>')
  await nextTick(() => {
    wrapper.result.current.inc()
  })
  expect(wrapper.html()).toEqual('<span>hello world 1</span>')
});
