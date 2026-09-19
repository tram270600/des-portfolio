import { site } from "@/data/site"

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-muted-foreground md:flex-row md:px-8">
        <p>
          © {site.year} {site.name}
        </p>
        <p>Product Designer · UI/UX</p>
      </div>
    </footer>
  )
}
