import { useCallback, useEffect, useId, useRef, useState } from "react"
import { ArrowUpRight, FileText, Search } from "lucide-react"

import { keyLabelFor } from "@/components/hero/keyboardKeys"
import { site } from "@/data/site"
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect"
import { SEARCH_IGNORE_ATTR, highlightQuery, revealElement, searchPage, type SearchResult } from "@/lib/pageSearch"
import { cn } from "@/lib/utils"
import { useSearchStore } from "@/store/search"

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent)

export function SearchCta() {
  const query = useSearchStore((state) => state.query)
  const setQuery = useSearchStore((state) => state.setQuery)
  const setPressedKey = useSearchStore((state) => state.setPressedKey)
  const openFind = useSearchStore((state) => state.openFind)

  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [search, setSearch] = useState<{ query: string; results: SearchResult[]; total: number }>({
    query: "",
    results: [],
    total: 0,
  })

  useDebouncedEffect(query, 250, (value) => {
    setSearch({ query: value, ...searchPage(value) })
    setActiveIndex(-1)
  })

  const focusSearch = useCallback(() => {
    document.getElementById("home")?.scrollIntoView({ block: "start" })
    const input = inputRef.current
    if (!input) return
    input.focus({ preventScroll: true })
    const placeCaret = () => {
      const end = input.value.length
      input.setSelectionRange(end, end)
    }
    placeCaret()
    requestAnimationFrame(placeCaret)
    setFocused(true)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "p") return
      event.preventDefault()
      focusSearch()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [focusSearch])

  const { results, total } = search
  const searchedQuery = search.query.trim()
  const showResults = focused && searchedQuery.length > 0

  const dismiss = () => {
    inputRef.current?.blur()
    setFocused(false)
  }

  const goTo = (result: SearchResult) => {
    const section = (result.element.closest("section") as HTMLElement | null) ?? result.element
    dismiss()
    highlightQuery(section, search.query)
    revealElement(result.element)
  }

  return (
    <form
      className="relative mx-auto box-border w-full min-w-0 max-w-full md:max-w-[560px]"
      onSubmit={(event) => {
        event.preventDefault()
        const active = results[activeIndex]
        if (showResults && active) {
          goTo(active)
        } else if (query.trim()) {
          dismiss()
          openFind()
        }
      }}
    >
      <div className="paper-card max-w-full rounded-[22px] p-2 sm:rounded-[28px] sm:p-3 md:p-4">
        <div className="flex min-w-0 items-center gap-2 rounded-full border-[1.5px] border-red px-3 py-2 transition-shadow focus-within:ring-4 focus-within:ring-red/15 sm:gap-3 sm:px-4 sm:py-2.5 md:px-5 md:py-3">
          <Search className="size-4 shrink-0 text-red" aria-hidden />
          <label
            htmlFor="hero-search"
            className="flex min-w-0 flex-1 cursor-text items-center text-left text-base font-medium md:text-lg"
          >
            <span className="sr-only">{`Search ${site.name}'s portfolio`}</span>
            <span
              className={cn(
                "inline-grid min-w-0 max-w-full rounded-sm px-1 py-0.5",
                query && "bg-yellow",
              )}
            >
              <span aria-hidden className="invisible col-start-1 row-start-1 truncate whitespace-pre">
                {query || "Search the portfolio"}
              </span>
              <input
                ref={inputRef}
                id="hero-search"
                type="text"
                role="combobox"
                autoComplete="off"
                spellCheck={false}
                aria-expanded={showResults}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
                placeholder="Search the portfolio"
                value={query}
                size={1}
                onChange={(event) => {
                  setFocused(true)
                  setQuery(event.target.value)
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false)
                  setPressedKey(null)
                }}
                onKeyDown={(event) => {
                  setPressedKey(keyLabelFor(event.key))
                  if (event.key === "Escape") {
                    dismiss()
                  } else if (showResults && results.length > 0 && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
                    event.preventDefault()
                    const step = event.key === "ArrowDown" ? 1 : -1
                    setActiveIndex((index) => {
                      const next = index + step
                      if (next >= results.length) return -1
                      if (next < -1) return results.length - 1
                      return next
                    })
                  }
                }}
                onKeyUp={() => setPressedKey(null)}
                className="col-start-1 row-start-1 w-full min-w-[1ch] bg-transparent text-foreground caret-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
            </span>
          </label>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={focusSearch}
            className="hidden shrink-0 cursor-pointer rounded-md border border-border bg-background px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted-foreground sm:inline-block"
            aria-label={isMac ? "Search, Command P" : "Search, Control P"}
          >
            {isMac ? "⌘P" : "Ctrl P"}
          </button>
          <button
            type="submit"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-red transition-colors hover:bg-red/10 sm:size-8"
            aria-label="Find in page"
          >
            <ArrowUpRight className="size-5" />
          </button>
        </div>
      </div>

      {showResults ? (
        <div
          {...{ [SEARCH_IGNORE_ATTR]: "" }}
          className="absolute inset-x-0 top-full z-30 mt-2 rounded-[22px] border border-black/5 bg-card p-2 text-left shadow-[0_20px_50px_rgba(26,26,26,0.12)]"
        >
          <div className="flex items-center justify-between px-3 pt-1 pb-2 text-xs text-muted-foreground">
            <span>Search results ({total})</span>
            <span>Best matches</span>
          </div>
          <ul id={listboxId} role="listbox" aria-label="Search results" className="space-y-1">
            {results.map((result, index) => (
              <li
                key={result.label}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goTo(result)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                  index === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{result.label}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {result.snippet.before}
                    <mark className="rounded-sm bg-yellow px-0.5 text-foreground">{result.snippet.match}</mark>
                    {result.snippet.after}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {results.length === 0 ? (
            <p className="px-3 pb-2 text-sm text-muted-foreground">No matches for “{searchedQuery}”.</p>
          ) : (
            <p className="px-3 pt-2 pb-1 text-[11px] text-muted-foreground">
              Press <kbd className="font-sans font-semibold">Enter</kbd> to find every match on the page
            </p>
          )}
        </div>
      ) : null}

      <div className="pointer-events-none absolute -right-3 top-[58%] hidden lg:block lg:-right-24">
        <img
          src="/images/hero-cursor.png"
          alt=""
          aria-hidden
          width={25}
          height={27}
          className="absolute top-1 -left-1.5 z-10 [filter:drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_0.5px_#fff)]"
        />
        <div className="pointer-events-auto flex items-center gap-2 rounded-r-full rounded-bl-full bg-white/80 py-2 pr-2.5 pl-7 shadow-[0_4px_20px_rgba(0,105,215,0.3)] backdrop-blur-sm">
          <span className="block size-[54px] shrink-0 overflow-hidden rounded-full border-[3px] border-white">
            <img
              src="/images/hero-avatar.png"
              alt=""
              aria-hidden
              className="size-full object-cover"
            />
          </span>
          <span className="pr-2 text-lg font-semibold text-primary">{site.year}</span>
        </div>
      </div>
    </form>
  )
}
