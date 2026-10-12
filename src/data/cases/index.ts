import { damCase } from "@/data/cases/dam"
import { schoolCmsCase } from "@/data/cases/school-cms"
import { teachingToolCase } from "@/data/cases/teaching-tool"
import { smartSiteSafetySystemCase } from "./smart-site-safety-system"
import type { CaseStudy } from "@/data/cases/types"

export const caseStudies: CaseStudy[] = [damCase, schoolCmsCase, teachingToolCase, smartSiteSafetySystemCase]

export function findCaseStudy(id: string | null) {
  if (!id) return null
  return caseStudies.find((study) => study.id === id) ?? null
}
