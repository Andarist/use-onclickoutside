import { useEffect } from 'react'
import arePassiveEventsSupported from 'are-passive-events-supported'
import useLatest from 'use-latest'
import isBrowser from './isBrowser.macro'

const MOUSEDOWN = 'mousedown'
const TOUCHSTART = 'touchstart'

export type HandledEvents = [typeof MOUSEDOWN, typeof TOUCHSTART]
export type HandledEventsType = HandledEvents[number]
export type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type]
}[HandledEventsType]
export type Handler = (event: PossibleEvent) => void

const events: HandledEvents = [MOUSEDOWN, TOUCHSTART]

const getOptions = (event: HandledEventsType) => {
  if (event !== TOUCHSTART) {
    return
  }

  if (arePassiveEventsSupported()) {
    return { passive: true }
  }
}

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: Handler | null,
) {
  if (!isBrowser) {
    return
  }

  const handlerRef = useLatest(handler)

  useEffect(() => {
    if (!handler) {
      return
    }

    const listener = (event: PossibleEvent) => {
      if (
        !ref.current ||
        !handlerRef.current ||
        ref.current.contains(event.target as Node)
      ) {
        return
      }

      handlerRef.current(event)
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
  }, [!handler])
}
