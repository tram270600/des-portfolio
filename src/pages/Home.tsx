import { About } from "@/components/about/About"
import { Contact } from "@/components/contact/Contact"
import { Experience } from "@/components/experience/Experience"
import { FindBar } from "@/components/layout/FindBar"
import { Hero } from "@/components/hero/Hero"
import { Navbar } from "@/components/layout/Navbar"
import { SkipLink } from "@/components/layout/SkipLink"
import { Projects } from "@/components/projects/Projects"
// import { Services } from "@/components/services/Services"
import { Skills } from "@/components/skills/Skills"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useScrollSpy } from "@/hooks/useScrollSpy"
import { useHomeScrollMemory } from "@/lib/homeScroll"
import { Playground } from "@/components/playground/Playground"

export function Home() {
  useScrollSpy()
  useHomeScrollMemory()

  return (
    <TooltipProvider>
      <SkipLink />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        {/* <Services /> */}
        <Playground />
        <Contact />
      </main>
      <FindBar />
    </TooltipProvider>
  )
}
