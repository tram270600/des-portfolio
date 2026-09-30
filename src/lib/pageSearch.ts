export const SEARCH_IGNORE_ATTR = "data-search-ignore"

const SKIPPED_SECTIONS = new Set(["home", "contents"])

type Entry = {
  label: string
  title: string
  text: string
  element: HTMLElement
}

export type Snippet = { before: string; match: string; after: string }

export type SearchResult = {
  label: string
  snippet: Snippet
  element: HTMLElement
}

const normalize = (value: string) => value.replace(/\s+/g, " ").trim()

// The outermost ancestor of each h3 that holds no other heading is the item card.
function itemsOf(section: HTMLElement) {
  return Array.from(section.querySelectorAll("h3"), (heading) => {
    let element: HTMLElement = heading
    let parent = element.parentElement
    while (
      parent &&
      parent !== section &&
      !parent.querySelector("h2") &&
      parent.querySelectorAll("h3").length === 1
    ) {
      element = parent
      parent = element.parentElement
    }
    return { title: normalize(heading.textContent ?? ""), element }
  })
}

function textOutside(root: HTMLElement, excluded: HTMLElement[]) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let text = ""
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement
    if (parent?.closest(`[${SEARCH_IGNORE_ATTR}]`)) continue
    if (!excluded.some((element) => element.contains(node))) text += ` ${node.nodeValue}`
  }
  return normalize(text)
}

// Section headings render the index and name as separate text ("01", "About me").
function headingLabel(heading: HTMLElement) {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
  const parts: string[] = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const part = normalize(node.nodeValue ?? "")
    if (part) parts.push(part)
  }
  const [first, ...rest] = parts
  if (rest.length > 0 && /^\d+$/.test(first)) return `${first}. ${rest.join(" ")}`
  return parts.join(" ")
}

function collectEntries() {
  const entries: Entry[] = []
  document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
    if (SKIPPED_SECTIONS.has(section.id)) return

    const heading = section.querySelector("h2")
    const sectionTitle = heading ? headingLabel(heading) : section.id
    const items = itemsOf(section)

    for (const { title, element } of items) {
      entries.push({
        label: `${sectionTitle} > ${title}`,
        title,
        text: textOutside(element, []),
        element,
      })
    }
    entries.push({
      label: sectionTitle,
      title: sectionTitle,
      text: textOutside(section, items.map((item) => item.element)),
      element: section,
    })
  })
  return entries
}

function countOccurrences(haystack: string, needle: string) {
  let count = 0
  for (let index = haystack.indexOf(needle); index !== -1; index = haystack.indexOf(needle, index + needle.length)) {
    count += 1
  }
  return count
}

function makeSnippet(text: string, query: string, tokens: string[]): Snippet {
  const lower = text.toLowerCase()
  let index = lower.indexOf(query)
  let length = query.length
  if (index === -1) {
    const token = tokens.find((candidate) => lower.includes(candidate)) ?? ""
    index = token ? lower.indexOf(token) : 0
    length = token.length
  }
  const start = Math.max(0, index - 32)
  const end = Math.min(text.length, index + length + 48)
  return {
    before: `${start > 0 ? "…" : ""}${text.slice(start, index)}`,
    match: text.slice(index, index + length),
    after: `${text.slice(index + length, end)}${end < text.length ? "…" : ""}`,
  }
}

export function searchPage(rawQuery: string, limit = 3) {
  const query = normalize(rawQuery).toLowerCase()
  if (!query) return { results: [] as SearchResult[], total: 0 }

  const tokens = query.split(" ")
  const ranked = collectEntries()
    .flatMap((entry) => {
      const title = entry.title.toLowerCase()
      const haystack = `${title} ${entry.text.toLowerCase()}`
      if (!tokens.every((token) => haystack.includes(token))) return []

      const score =
        (title.includes(query) ? 30 : 0) +
        tokens.filter((token) => title.includes(token)).length * 10 +
        countOccurrences(haystack, query) * 2
      return [{ entry, score }]
    })
    .sort((a, b) => b.score - a.score)

  return {
    total: ranked.length,
    results: ranked.slice(0, limit).map(({ entry }) => ({
      label: entry.label,
      element: entry.element,
      snippet: makeSnippet(entry.text, query, tokens),
    })),
  }
}

const FIND_ALL = "page-find"
const FIND_CURRENT = "page-find-current"

function isRendered(element: HTMLElement) {
  if (element.checkVisibility && !element.checkVisibility({ visibilityProperty: true })) return false
  const rect = element.getBoundingClientRect()
  return rect.width > 1 && rect.height > 1
}

function collectRanges(root: Node, query: string, onlyRendered: boolean) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || parent.closest(`[${SEARCH_IGNORE_ATTR}], script, style, noscript`)) {
        return NodeFilter.FILTER_REJECT
      }
      if (onlyRendered && !isRendered(parent)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const ranges: Range[] = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue?.toLowerCase() ?? ""
    for (let index = text.indexOf(query); index !== -1; index = text.indexOf(query, index + query.length)) {
      const range = document.createRange()
      range.setStart(node, index)
      range.setEnd(node, index + query.length)
      ranges.push(range)
    }
  }
  return ranges
}

export function findTextRanges(rawQuery: string) {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return []
  return collectRanges(document.body, query, true)
}

export function highlightQuery(root: HTMLElement, rawQuery: string) {
  if (!("highlights" in CSS)) return
  const query = rawQuery.trim().toLowerCase()
  CSS.highlights.delete(FIND_CURRENT)
  if (!query) {
    CSS.highlights.delete(FIND_ALL)
    return
  }
  const ranges = collectRanges(root, query, false)
  if (ranges.length === 0) {
    CSS.highlights.delete(FIND_ALL)
    return
  }
  CSS.highlights.set(FIND_ALL, new Highlight(...ranges))
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function revealElement(element: HTMLElement) {
  element.scrollIntoView({ block: element.tagName === "SECTION" ? "start" : "center" })
  if (prefersReducedMotion()) return
  element.animate(
    [
      { boxShadow: "0 0 0 4px var(--yellow)" },
      { boxShadow: "0 0 0 4px var(--yellow)", offset: 0.6 },
      { boxShadow: "0 0 0 0 transparent" },
    ],
    { duration: 1600, easing: "ease-out" },
  )
}

export function revealRange(range: Range) {
  const rect = range.getBoundingClientRect()
  window.scrollTo({ top: window.scrollY + rect.top - window.innerHeight / 2 })
}

export function paintMatches(ranges: Range[], current: number) {
  if (!("highlights" in CSS)) return
  CSS.highlights.set(FIND_ALL, new Highlight(...ranges))
  const active = ranges[current]
  if (active) CSS.highlights.set(FIND_CURRENT, new Highlight(active))
  else CSS.highlights.delete(FIND_CURRENT)
}

export function clearMatches() {
  if (!("highlights" in CSS)) return
  CSS.highlights.delete(FIND_ALL)
  CSS.highlights.delete(FIND_CURRENT)
}
