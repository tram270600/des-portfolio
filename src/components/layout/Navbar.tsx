import { Menu } from "lucide-react"

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

export function Navbar() {
  const activeSection = useUIStore((state) => state.activeSection)
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen)
  const hidden = activeSection === "home"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b border-transparent bg-background/90 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none",
        hidden ? "-translate-y-full" : "translate-y-0 border-border/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <a href="#home" className="text-base font-semibold tracking-tight">
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                activeSection === item.id && "text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
          <Button asChild>
            <a href="#contact">Let's Chat</a>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Let's Chat</a>
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
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-base font-medium hover:bg-muted",
                  activeSection === item.id && "bg-muted text-primary",
                )}
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-4">
              <a href="#contact" onClick={() => setMobileNavOpen(false)}>
                Let's Chat
              </a>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
