import { cn } from "@/lib/utils"

type SectionTitleProps = {
  index: string
  children: string
  className?: string
}

export function SectionTitle({ index, children, className }: SectionTitleProps) {
  const label = children.charAt(0).toUpperCase() + children.slice(1)

  return (
    <h2
      className={cn(
        "flex items-baseline gap-3 font-sans text-3xl font-medium text-foreground md:gap-4 md:text-4xl",
        className,
      )}
    >
      <span className="font-normal text-[#9a9a9a]">{index}</span>
      <span>{label}</span>
    </h2>
  )
}
