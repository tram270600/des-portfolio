import { Playground as PlaygroundComponent } from "@/pages/Playground"
import { SectionTitle } from "../layout/SectionTitle"
import { Section } from "../layout/Section"

export function Playground() {
  return (
    <Section id="playground" contained={false} className="overflow-hidden bg-[#f7f7f7]">
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <SectionTitle className="pb-16" index="05">Playground</SectionTitle>
        <PlaygroundComponent embedded />
      </div>
    </Section>
  )
}
