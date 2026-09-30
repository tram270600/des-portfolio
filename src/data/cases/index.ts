import { schoolCmsCase } from "@/data/cases/school-cms"
import type { CaseStudy } from "@/data/cases/types"

export const caseStudies: CaseStudy[] = [schoolCmsCase]

export function findCaseStudy(id: string | null) {
  if (!id) return null
  return caseStudies.find((study) => study.id === id) ?? null
}
