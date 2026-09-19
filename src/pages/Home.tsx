import { About } from "@/components/about/About"
import { Contact } from "@/components/contact/Contact"
import { Experience } from "@/components/experience/Experience"
import { Hero } from "@/components/hero/Hero"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SkipLink } from "@/components/layout/SkipLink"
import { Projects } from "@/components/projects/Projects"
import { Services } from "@/components/services/Services"
import { Skills } from "@/components/skills/Skills"
import { TableOfContents } from "@/components/toc/TableOfContents"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useScrollSpy } from "@/hooks/useScrollSpy"

export function Home() {
  useScrollSpy()

  return (
    <TooltipProvider>
      <SkipLink />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <TableOfContents />
        <Experience />
        <Projects />
        <Skills />
        <Services />
        <Contact />
      </main>
      <Footer />
    </TooltipProvider>
  )
}
