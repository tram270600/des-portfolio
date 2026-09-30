export type CaseFact = {
  label: string
  value: string
}

export type CaseCopy = {
  label: string
  body: string
}

export type CaseFigure = {
  src: string
  alt: string
  caption: string
}

export type CaseMedia =
  | { layout: "single"; figure: CaseFigure }
  | { layout: "pair"; figures: CaseFigure[] }

export type CaseGroup = {
  title: string
  body?: string
  points?: string[]
  media?: CaseMedia[]
}

export type CaseSection =
  | {
      id: string
      label: string
      kind: "overview"
      eyebrow: string
      facts: CaseFact[]
      summary: CaseCopy[]
      notes: CaseCopy[]
      figure?: CaseFigure
    }
  | {
      id: string
      label: string
      kind: "prose"
      paragraphs: string[]
    }
  | {
      id: string
      label: string
      kind: "research"
      intro: string
      areas: { title: string; problem: string; opportunity: string }[]
    }
  | {
      id: string
      label: string
      kind: "groups"
      groups: CaseGroup[]
    }

export type CaseStudy = {
  id: string
  title: string
  href: string
  sections: CaseSection[]
}
