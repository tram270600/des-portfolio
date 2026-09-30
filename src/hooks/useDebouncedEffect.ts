import { useEffect, useLayoutEffect, useRef } from "react"

export function useDebouncedEffect<T>(value: T, delay: number, effect: (value: T) => void) {
  const effectRef = useRef(effect)

  useLayoutEffect(() => {
    effectRef.current = effect
  })

  useEffect(() => {
    const id = window.setTimeout(() => effectRef.current(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
}
