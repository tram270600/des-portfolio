import { useLayoutEffect, useRef, useState } from "react"
import { Menu } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { navItems, site } from "@/data/site"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui"

const rollEase = [0.338, 0.015, 0.395, 0.959] as const

const outgoingVariants = {
  rest: { y: "0%" },
  active: { y: "100%" },
}

const incomingVariants = {
  rest: { y: "-100%" },
  active: { y: "0%" },
}

const rollTransition = {
  duration: 0.3,
  ease: rollEase,
}

const strokeGap = 4

type Stroke = {
  x: number
  y: number
  width: number
}

function RollingNavLink({
  href,
  label,
  active,
  linkRef,
}: {
  href: string
  label: string
  active: boolean
  linkRef: (node: HTMLAnchorElement | null) => void
}) {
  const reduceMotion = useReducedMotion()
  const [rolling, setRolling] = useState(false)
  const rollingRef = useRef(false)
  const animating = useRef(false)
  const pendingRequest = useRef<boolean | null>(null)
  const hovered = useRef(false)
  const focused = useRef(false)

  const updateRolling = (next: boolean) => {
    rollingRef.current = next
    setRolling(next)
  }

  const requestRolling = (next: boolean) => {
    if (reduceMotion) return

    if (next === rollingRef.current) {
      pendingRequest.current = null
      return
    }

    if (animating.current) {
      pendingRequest.current = next
      return
    }

    animating.current = true
    updateRolling(next)
  }

  const completeAnimation = () => {
    if (!animating.current) return
    animating.current = false

    if (pendingRequest.current !== null && pendingRequest.current !== rollingRef.current) {
      const next = pendingRequest.current
      pendingRequest.current = null
      animating.current = true
      updateRolling(next)
    } else {
      pendingRequest.current = null
    }
  }

  return (
    <motion.a
      ref={linkRef}
      href={href}
      className={cn(
        "rounded-sm text-sm font-medium text-foreground/70 transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        active && "text-foreground",
      )}
      onHoverStart={() => {
        hovered.current = true
        requestRolling(true)
      }}
      onHoverEnd={() => {
        hovered.current = false
        requestRolling(focused.current)
      }}
      onFocus={() => {
        focused.current = true
        requestRolling(true)
      }}
      onBlur={() => {
        focused.current = false
        requestRolling(hovered.current)
      }}
    >
      <span className="relative block overflow-hidden">
        <motion.span
          className="block whitespace-nowrap"
          variants={outgoingVariants}
          initial="rest"
          animate={rolling ? "active" : "rest"}
          transition={rollTransition}
          onAnimationComplete={completeAnimation}
        >
          {label}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 block whitespace-nowrap"
          variants={incomingVariants}
          initial="rest"
          animate={rolling ? "active" : "rest"}
          transition={rollTransition}
        >
          {label}
        </motion.span>
      </span>
    </motion.a>
  )
}

export function Navbar({ home = true }: { home?: boolean }) {
  const activeSection = useUIStore((state) => state.activeSection)
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen)
  const reduceMotion = useReducedMotion()
  const hidden = home && activeSection === "home"
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  const currentNav = path === "/playground" ? "playground" : activeSection
  const hrefFor = (href: string) => {
    if (href.startsWith("/")) return href
    return home ? href : `/${href}`
  }
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
  const [stroke, setStroke] = useState<Stroke | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const measure = () => {
      const link = linkRefs.current.get(currentNav)
      const linkRect = link?.getBoundingClientRect()
      if (!link || !linkRect || linkRect.width === 0) {
        setStroke(null)
        return
      }

      const navRect = nav.getBoundingClientRect()
      const next = {
        x: Math.round(linkRect.left - navRect.left),
        y: Math.round(linkRect.bottom - navRect.top + strokeGap),
        width: Math.round(linkRect.width),
      }
      setStroke((current) =>
        current && current.x === next.x && current.y === next.y && current.width === next.width
          ? current
          : next,
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(nav)
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    window.addEventListener("resize", measure)

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [currentNav])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/90 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0 border-border/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <a href={hrefFor("#home")} className="text-base font-semibold tracking-tight">
          {site.name}
        </a>

        <nav ref={navRef} aria-label="Primary" className="relative hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <RollingNavLink
              key={item.id}
              href={hrefFor(item.href)}
              label={item.label}
              active={currentNav === item.id}
              linkRef={(node) => {
                if (node) linkRefs.current.set(item.id, node)
                else linkRefs.current.delete(item.id)
              }}
            />
          ))}
          <AnimatePresence>
            {stroke && (
              <motion.span
                key="nav-stroke"
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 block h-px bg-foreground"
                initial={{ opacity: 0, x: stroke.x, y: stroke.y, width: stroke.width }}
                animate={{ opacity: 1, x: stroke.x, y: stroke.y, width: stroke.width }}
                exit={{ opacity: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 36, mass: 0.7 }
                }
              />
            )}
          </AnimatePresence>
          <Button asChild>
            <a href={hrefFor("#contact")}>Let's Chat</a>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={hrefFor("#contact")}>Let's Chat</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{site.name}</SheetTitle>
            <SheetDescription>Jump to a section</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={hrefFor(item.href)}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-base font-medium hover:bg-muted",
                  currentNav === item.id && "bg-muted text-primary",
                )}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-4">
              <a href={hrefFor("#contact")} onClick={() => setMobileNavOpen(false)}>
                Let's Connect
              </a>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
