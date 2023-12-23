import { useEffect } from 'react'
import arePassiveEventsSupported from 'are-passive-events-supported'
import useLatest from 'use-latest'

const MOUSEDOWN = 'mousedown'
const TOUCHSTART = 'touchstart'

export type HandledEvents = [typeof MOUSEDOWN, typeof TOUCHSTART]
export type HandledEventsType = HandledEvents[number]
export type PossibleEvent = {
  [Type in HandledEventsType]: HTMLElementEventMap[Type]
}[HandledEventsType]
export type Handler = (event: PossibleEvent) => void

const events: HandledEvents = [MOUSEDOWN, TOUCHSTART]

const getAddOptions = (
  event: HandledEventsType,
): AddEventListenerOptions | undefined => {
  if (event === TOUCHSTART && arePassiveEventsSupported()) {
    return { passive: true }
  }
}

const currentDocument = typeof document !== 'undefined' ? document : undefined

export default function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: Handler | null,
  { document = currentDocument } = {},
) {
  if (typeof document === 'undefined') {
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
      document.addEventListener(event, listener, getAddOptions(event))
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener)
      })
    }
  }, [!handler])
}
