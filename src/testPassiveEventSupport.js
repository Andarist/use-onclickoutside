let supportsPassiveEvents

export default function testPassiveEventSupport() {
  if (supportsPassiveEvents !== undefined) {
    return supportsPassiveEvents
  }

  let passive = false

  const options = Object.defineProperty({}, 'passive', {
    get() {
      passive = true
    },
  })

  const noop = () => {}

  window.addEventListener('test', noop, options)
  window.removeEventListener('test', noop, options)

  supportsPassiveEvents = passive
  return passive
}
