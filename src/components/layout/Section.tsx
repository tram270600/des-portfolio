import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type SectionProps = ComponentProps<"section"> & {
  id: string
  contained?: boolean
}

export function Section({
  id,
  className,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-16 md:py-24 lg:py-28", className)}
      {...props}
    >
      {contained ? (
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  )
}
