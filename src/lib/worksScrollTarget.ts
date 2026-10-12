/**
 * The Selected Works section stacks every project's copy in one pinned stage, so
 * scrolling an element into view would not activate its project. These helpers
 * map such an element to the scroll offset where its project is the active one.
 */
export function projectScrollTop(from: Node | null): number | null {
  const element = from instanceof Element ? from : (from?.parentElement ?? null)
  const copy = element?.closest<HTMLElement>("[data-project-index]")
  const track = copy?.closest<HTMLElement>("#projects")
  if (!copy || !track) return null

  const index = Number(copy.dataset.projectIndex)
  const count = Number(track.dataset.projectCount)
  if (!Number.isFinite(index) || !Number.isFinite(count) || count <= 0) return null

  const scrollable = track.offsetHeight - window.innerHeight
  const start = track.getBoundingClientRect().top + window.scrollY
  return start + (index / count) * scrollable
}
