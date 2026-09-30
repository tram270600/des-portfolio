export type ExperienceType = {
  id: string
  menu: string[]
  subtitle: string
  role: string
  period: string
  responsibilities: string[]
  tools: string[]
  logo: string
  listName: string
  listRole: string
  listPeriod: string
  comingSoon?: boolean
}

export const experiences: ExperienceType[] = [
  {
    id: "smartlink",
    menu: ["SmartLink"],
    subtitle: "Software Technology",
    role: "Middle Product Designer",
    period: "April 2026 - Present",
    responsibilities: [],
    tools: [],
    logo: "/images/experience/smartlink.png",
    listName: "SmartLink",
    listRole: "Middle Product Designer",
    listPeriod: "April 2026 - Present",
    comingSoon: true,
  },
  {
    id: "saturnai",
    menu: ["SaturnAI", "- Solomon"],
    subtitle: "Industrial automation & augmented intelligence corporation",
    role: "UI/UX Designer",
    period: "Aug 2025 - Present",
    responsibilities: [
      "Responsible for end-to-end design process, from ideation and user flows to wireframes and high-fidelity UI.",
      "Collaborated closely with developers to ensure design feasibility and UI consistency.",
      "Contributed to building an Computer vision training models desktop application by understanding AI training workflows.",
      "Established a core design system and extended it across projects while aligning with client design guidelines.",
    ],
    tools: ["Design System", "Figma", "Figjam", "End-to-end process"],
    logo: "/images/experience/solomon.png",
    listName: "Solomon",
    listRole: "Junior Product Designer",
    listPeriod: "Aug 2025 - March 2026",
  },
  {
    id: "knowylab",
    menu: ["KnowyLab"],
    subtitle: "AI-empowered Teaching Platform",
    role: "Freelance UI/UX Designer",
    period: "Oct 2024 - May 2025",
    responsibilities: [
      "Handle user research, wireframing, high-fidelity UI design & prototyping",
      "Propose improvements in developed projects such as usability improvements, responsive and accessible design",
      "Implement testing such as Usability Testing, User Behavior Testing: A/B Testing, Heatmaps & Click Tracking, Accessibility Testing: Contrast & Color Tests, and Performance & Functional Testing",
    ],
    tools: ["Figma", "Figjam", "Testing", "Hotjar"],
    logo: "/images/experience/knowylab.png",
    listName: "Knowylab",
    listRole: "Freelance Product Designer",
    listPeriod: "Oct 2024 - May 2025",
  },
  {
    id: "viact",
    menu: ["viAct"],
    subtitle: "Safety & Construction Management Software App",
    role: "Product Designer",
    period: "Aug 2022 - Aug 2024",
    responsibilities: [
      "Analyzing requirements by focusing on user needs, business goals, and technical feasibility.",
      "Play a key role in the end-to-end design process, from user research to final implementation: wireframe, prototypes, and visual user interfaces with fully responsive: desktop, tablet, and mobile.",
      "Documenting design handover, functionality discussion, and UI / UX testing before and after the product is ready for production.",
      "Collaborate with the Marketing team to create feature pages showcasing products, gather requirements from the Sales team to develop a monthly report feature, and support efforts to attract new users and win contracts.",
      "Familiar with design systems using Storybook, and supportive libraries like Tailwind, Ant Design, Material UI, etc.",
    ],
    tools: ["Figma", "Figjam", "Photoshop", "Confluence", "Wix", "Whimsical"],
    logo: "/images/experience/viact.png",
    listName: "viAct",
    listRole: "Product Designer",
    listPeriod: "Aug 2022 - Aug 2024",
  },
  {
    id: "sssmarket",
    menu: ["SSSMarket"],
    subtitle: "Fashion Sharing Mobile App",
    role: "UI/UX Designer",
    period: "Oct 2020 - May 2022",
    responsibilities: [
      "Taking responsibility for conducting ideas, creating engaging and user-friendly digital interfaces for websites, mobile applications, and other interactive media",
      "Specializing in Ideation & Prototyping, User-Centered Design, Metrics-Driven Design, Iterative Design, Prototyping & Testing, and Design Systems",
      "Conducting user research, creating personas, and mapping user journeys to inform design decisions.",
      "Generating innovative ideas through brainstorming sessions and sketching, translating concepts into wireframes, mockups, and interactive prototypes using tools like Figma, Miro, Metabase, Wix, Whimsical.",
    ],
    tools: ["Figma", "Figjam", "Miro", "Metabase", "Wix"],
    logo: "/images/experience/sssmarket.png",
    listName: "SSSMarket",
    listRole: "UI/UX Designer",
    listPeriod: "Oct 2020 - May 2022",
  },
]
