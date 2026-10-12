import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type HeroSectionLabelProps = {
  index: string
  label: string
  href?: string
  className?: string
  style?: CSSProperties
}

export function HeroSectionLabel({ index, label, href, className, style }: HeroSectionLabelProps) {
  const classes = cn(
    "pointer-events-auto inline-flex items-baseline gap-1.5 whitespace-nowrap font-sans text-lg font-medium leading-none tracking-tight text-foreground",
    className,
  )
  const content = (
    <>
      <span className="font-normal text-[#9a9a9a]">({index})</span>
      <span>{label}</span>
    </>
  )

  if (!href) {
    return (
      <span className={classes} style={style} aria-label={`${index}. ${label}`}>
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      aria-label={`${index}. ${label}`}
      className={cn(classes, "cursor-pointer transition-colors hover:text-primary")}
      style={style}
    >
      {content}
    </a>
  )
}
