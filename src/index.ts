import { useEffect } from 'react'
import arePassiveEventsSupported from 'are-passive-events-supported'
import isBrowser from './isBrowser.macro'

const ONCE: [] = []
const MOUSEDOWN = 'mousedown'
const TOUCHSTART = 'touchstart'

type HandledEvents = [typeof MOUSEDOWN, typeof TOUCHSTART]
type HandledEventsType = HandledEvents[number]
type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type]
}[HandledEventsType]

const events: HandledEvents = [MOUSEDOWN, TOUCHSTART]

const getOptions = (event: HandledEventsType) => {
  if (event !== TOUCHSTART) {
    return
  }

  if (arePassiveEventsSupported()) {
    return { passive: true }
  }
}

const d: HTMLDivElement = document.createElement('div')

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: PossibleEvent) => void,
) {
  if (!isBrowser) {
    return
  }

  useEffect(() => {
    const listener = (event: PossibleEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    events.forEach(event => {
      document.addEventListener(event, listener, getOptions(event))
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener, getOptions(
          event,
        ) as EventListenerOptions)
      })
    }
  }, ONCE)
}
