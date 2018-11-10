import { useEffect } from 'react'
import arePassiveEventsSupported from 'are-passive-events-supported'
import isBrowser from './isBrowser.macro'

const ONCE = []
const MOUSEDOWN = 'mousedown'
const TOUCHSTART = 'touchstart'
const events = [MOUSEDOWN, TOUCHSTART]

const getOptions = event => {
  if (event !== TOUCHSTART) {
    return
  }

  if (arePassiveEventsSupported()) {
    return { passive: true }
  }
}

export default function useOnClickOutside(ref, handler) {
  if (!isBrowser) {
    return
  }

  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }

      handler(event)
    }

    events.forEach(event => {
      document.addEventListener(event, listener, getOptions(event))
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener, getOptions(event))
      })
    }
  }, ONCE)
}
