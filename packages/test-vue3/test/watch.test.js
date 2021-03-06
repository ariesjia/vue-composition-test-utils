const { ref, watch } = require('vue')
const {mountComposition, nextTick} = require('vue-composition-test-utils')

function useCounter(changed, initialValue = 0, ) {
  const count = ref(initialValue)
  const inc = (delta = 1) => (count.value += delta)
  watch(
    count,
    changed
  )
  return { count, inc }
}

test('should trigger watch when watch source changed', async function() {
  const fn = jest.fn()
  const wrapper = mountComposition(()=>useCounter(fn))
  expect(fn).not.toHaveBeenCalled()
  await nextTick(() => {
    wrapper.result.current.inc()
  })
  expect(fn).toHaveBeenCalled()
});
