export type SkillColumn = {
  title: string
  items: string[]
}

export type SkillSheet = {
  id: string
  label: string
  comingSoon?: boolean
  columns: SkillColumn[]
}

export const skillSheets: SkillSheet[] = [
  {
    id: "ui-ux",
    label: "UI/UX Design",
    columns: [
      {
        title: "UI",
        items: [
          "Prototypes",
          "Design System",
          "Mobile View",
          "Animation",
          "Features Screen",
          "Mockups",
          "Desktop View",
          "Site map",
          "Accessibility Version",
          "Moodboard",
        ],
      },
      {
        title: "UX",
        items: [
          "Accessibility & Revise",
          "Sketches",
          "Wireframes",
          "Problem Statements",
          "User Flow",
          "User Journey Maps",
          "Empathy Maps",
        ],
      },
      {
        title: "Tools",
        items: ["Figma", "Adobe XD", "Sketch", "Miro", "FigJam"],
      },
    ],
  },
  {
    id: "research",
    label: "User Research & Collaboration",
    columns: [
      {
        title: "Analysis",
        items: ["User Personas", "User Research", "Competitive Analysis"],
      },
      {
        title: "Tools",
        items: ["Notion", "Confluence", "Google Forms", "Google Analytics", "Hotjar", "Metabase"],
      },
    ],
  },
  {
    id: "visual",
    label: "Visual & Graphic Design",
    columns: [
      {
        title: "Tools",
        items: ["Adobe Photoshop", "Adobe Lightroom", "Canva", "Wacom Tablet"],
      },
    ],
  },
  {
    id: "frameworks",
    label: "UI Frameworks & Libraries",
    columns: [
      {
        title: "Libraries",
        items: ["Material UI", "Ant Design", "Tailwind CSS", "Bootstrap", "Storybook", "Lottie"],
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend Development",
    columns: [
      {
        title: "Stack",
        items: ["HTML5/CSS/SCSS", "JavaScript/TypeScript", "ReactJS"],
      },
    ],
  },
  {
    id: "ai",
    label: "AI Workflow",
    comingSoon: true,
    columns: [],
  },
]

export type SkillRow = {
  group: string
  focus: string
  skill: string
}

export const allSkillRows: SkillRow[] = skillSheets.flatMap((sheet) =>
  sheet.columns.flatMap((column) =>
    column.items.map((skill) => ({
      group: sheet.label,
      focus: column.title,
      skill,
    })),
  ),
)

export const totalSkillRows = allSkillRows.length

export function sheetLineCount(columns: SkillColumn[]) {
  return columns.reduce((sum, column) => sum + column.items.length, 0)
}
