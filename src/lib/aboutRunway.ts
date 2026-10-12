type Locker = () => void

let locker: Locker | null = null

export function registerAboutRunway(lock: Locker) {
  locker = lock
  return () => {
    if (locker === lock) locker = null
  }
}

// The About story reserves its scroll runway only after it pins. Lock that
// height before measuring a destination, or targets below About land short.
export function afterAboutLayout(run: () => void) {
  locker?.()
  requestAnimationFrame(() => requestAnimationFrame(run))
}
