import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Drives a horizontal scroll-snap track: how many pages it holds, which one is
 * showing, and how to move between them. A "page" is one full width of the
 * track, so the page count follows whatever the breakpoint shows per view.
 *
 * `signal` is any value that changes when the track's contents change (an item
 * count, say) so the measurement is redone once they arrive.
 */
export function useCarousel(signal = 0) {
  const trackRef = useRef(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)
  // mirrors `page` for callbacks that must not go stale between renders
  const pageRef = useRef(0)

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || !track.clientWidth) return
    setPages(Math.max(1, Math.round(track.scrollWidth / track.clientWidth)))
    pageRef.current = Math.round(track.scrollLeft / track.clientWidth)
    setPage(pageRef.current)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, signal])

  const goTo = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [])

  /** Advances one page, wrapping back to the start at the end. */
  const next = useCallback(() => {
    goTo(pageRef.current + 1 >= pages ? 0 : pageRef.current + 1)
  }, [goTo, pages])

  return { trackRef, page, pages, goTo, next, measure }
}
