import { Analytics } from "@vercel/analytics/react"
import { CaseStudyPage } from "@/components/case/CaseStudyPage"
import { findCaseStudy } from "@/data/cases"
import { AllProjects } from "@/pages/AllProjects"
import { Home } from "@/pages/Home"
import { Playground } from "@/pages/Playground"

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  if (path === "/playground") return (
    <>
      <Playground />
      <Analytics />
    </>
  )

  if (path === "/experience") {
    const caseId = new URLSearchParams(window.location.search).get("case")
    const study = findCaseStudy(caseId)
    if (study) return (
      <>
        <CaseStudyPage study={study} />
        <Analytics />
      </>
    )
    return (
      <>
        <AllProjects />
        <Analytics />
      </>
    )
  }

  return (
    <>
      <Home />
      <Analytics />
    </>
  )
}
