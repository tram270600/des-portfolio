import { CaseStudyPage } from "@/components/case/CaseStudyPage"
import { findCaseStudy } from "@/data/cases"
import { Home } from "@/pages/Home"

export default function App() {
  const caseId = new URLSearchParams(window.location.search).get("case")
  const study = window.location.pathname === "/experience" ? findCaseStudy(caseId) : null
  if (study) return <CaseStudyPage study={study} />

  return <Home />
}
