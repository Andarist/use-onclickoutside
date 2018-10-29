import { useEffect } from 'react'
import isBrowser from './isBrowser.macro'
import testPassiveEventSupport from './testPassiveEventSupport'

const TOUCHSTART = 'touchstart'
const events = ['mousedown', TOUCHSTART]

const getOptions = event => {
  if (event !== TOUCHSTART) {
    return
  }

  if (testPassiveEventSupport()) {
    return { passive: true }
  }
}

export default function useOnClickOutside(ref, handler) {
  if (!isBrowser) {
    return
  }

  useEffect(
    () => {
      if (!ref.current) {
        return
      }

      const listener = event => {
        if (ref.current.contains(event.target)) {
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
    },
    [ref.current, handler],
  )
}
