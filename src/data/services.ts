export type ServiceDocument = {
  index: string
  title: string
  description: string
  image?: string
}

export type ServiceDrawer = {
  index: number
  label: string
  /** Centered label on the folder sleeve, as in "DISCOVERY / 04 FILES". */
  cover: string
  variant: "folders" | "sheets"
  documents: ServiceDocument[]
}

export const SERVICE_COMPARTMENT_COUNT = 6

const discoveryDocuments: ServiceDocument[] = [
  {
    index: "01",
    title: "Product Discovery & Define",
    description:
      "Identify business goals, user needs, opportunities, and success metrics to create a clear product direction.",
  },
  {
    index: "02",
    title: "Problem Statement Define",
    description:
      "Analyze data & identify problem, visualize customer journey, user experiences to identify friction points and moments of value.",
  },
  {
    index: "03",
    title: "Ideation",
    description:
      "With problem statement in Discover & Define phase, start brainstorming solution that align business goals, product vision.",
  },
  {
    index: "04",
    title: "Requirements & Strategy",
    description:
      "Translate insights into actionable product requirements, goals, and roadmap recommendations.",
  },
]

const designDocuments: ServiceDocument[] = [
  {
    index: "01",
    title: "UI Design",
    description:
      "Design intuitive, visually appealing interfaces that balance user needs with business objectives.",
    image: "/images/services/order-list.png",
  },
  {
    index: "02",
    title: "Information Architecture",
    description:
      "Structure content, navigation and system structure to create intuitive experiences to ensure users can easily find and complete tasks.",
    image: "/images/services/sitemap.png",
  },
  {
    index: "03",
    title: "User Flow Mapping & Wireframing",
    description:
      "Define end-to-end journeys, key interactions to align stakeholders and reduce development risks.",
    image: "/images/services/sitemap.png",
  },
  {
    index: "04",
    title: "Interactive Prototyping",
    description: "Build clickable experiences to validate concepts before development begins.",
    image: "/images/services/order-list.png",
  },
]

/** Reading order: top-left is the first drawer. */
export const serviceDrawers: ServiceDrawer[] = [
  {
    index: 0,
    label: "Product discovery",
    cover: "Discovery",
    variant: "folders",
    documents: discoveryDocuments,
  },
  {
    index: 1,
    label: "Design services",
    cover: "Design",
    variant: "sheets",
    documents: designDocuments,
  },
]

export function serviceDrawerAt(index: number) {
  return serviceDrawers.find((drawer) => drawer.index === index)
}
