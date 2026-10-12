import type { CaseStudy } from "@/data/cases/types"

export const teachingToolCase: CaseStudy = {
  id: "teaching-tool",
  title: "Redesigning a Digital Whiteboard for Classroom Engagement",
  href: "/experience?case=teaching-tool",
  sections: [
    {
      id: "overview",
      label: "Project Overview",
      kind: "overview",
      eyebrow: "Project Insights",
      facts: [
        { label: "My role", value: "Product Designer" },
        { label: "Platform", value: "Web Application" },
        { label: "Target users", value: "Teachers and students in primary and secondary schools" },
        { label: "Tools", value: "Figma, FigJam, Photoshop" },
      ],
      summary: [
        {
          label: "Description",
          body: "An essential teaching tool that helps teachers create an interactive and engaging learning environment. It allows educators to visually explain concepts, encourage student participation, and make lessons more dynamic.",
        },
        {
          label: "Context",
          body: "Teachers reported a significant drop in digital adoption as classroom instruction returned to physical spaces. The existing whiteboard software felt outdated, with tools scattered across the interface, leading to “friction-heavy” lessons where students lost focus while teachers struggled to navigate complex menu systems.",
        },
      ],
      notes: [
        {
          label: "Motivation",
          body: "Improving usability and accessibility to boost student engagement in primary and secondary schools. This project transforms a fragmented toolset into a cohesive teaching experience.",
        },
      ],
      figure: {
        src: "/images/project-teaching.png",
        alt: "Classroom whiteboard showing an alphabet ebook, number and color cards, a dialogue prompt, and drawing tools along the edges of the board.",
        caption: "The lesson stays on the board. Drawing, pages, and classroom tools sit around it instead of inside menus.",
      },
    },
    {
      id: "challenge",
      label: "Challenge",
      kind: "prose",
      paragraphs: [
        "How might we help teachers explain a concept and keep students with them, when the software itself is what breaks the lesson?",
        "The existing whiteboard treated every action as a separate destination. Drawing, lesson pages, and classroom controls were scattered across the interface, so a simple move — pointing at a letter, turning a page, or opening a discussion — meant hunting through menus. In a physical classroom, that pause is visible. Students lose the thread while the teacher looks for the next tool.",
      ],
    },
    {
      id: "figma",
      label: "Solution",
      kind: "figma",
      isFullScreen: false,
      embedUrl: "https://embed.figma.com/proto/z2xPzKl5o6L0zF1p1h5YGY/Tram-Nguyen---Product-Designer-Resume?page-id=0%3A1&node-id=2262-8104&recovery=true&viewport=607%2C225%2C0.2&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2084%3A2513&embed-host=share",
    },
    {
      id: "research",
      label: "Discovery & Insights",
      kind: "groups",
      groups: [
        {
          title: "Research goals",
          points: [
            "Identify the most frequent points of friction during live classroom instruction.",
            "Understand the sensory needs of primary vs. secondary school environments.",
            "Benchmark existing teaching tools against modern interaction standards.",
          ],
        },
        {
          title: "Classroom observation",
          body: "Watching real-time usage to catch non-verbal frustration cues from students.",
        },
        {
          title: "Teacher interviews",
          body: "1-on-1 sessions to map out lesson preparation and resource management flows.",
        },
        {
          title: "Student testing",
          body: "Usability testing with diverse age groups to ensure kid-friendly interaction zones.",
        },
        {
          title: "Ticket analysis",
          body: "Reviewing support history to find recurring technical blockers in the legacy UI.",
        },
      ],
    },
    {
      id: "vision",
      label: "Defining the Vision",
      kind: "groups",
      groups: [
        {
          title: "Participation, not just observation",
          body: "Every lesson should create opportunities for participation, not just observation. The whiteboard is the lesson, not a container the lesson has to fight through. Content, markup, and classroom controls share one surface, so a teacher can explain and a student can respond without leaving the page.",
        },
        {
          title: "One board",
          body: "The lesson canvas stays in the center. Pages, activities, and prompts are the thing the class looks at. Tools do not replace it.",
        },
        {
          title: "Tools within reach",
          body: "Drawing, classroom actions, and utilities move to the edges of the board. Each rail has one job, and it stays put for the whole lesson.",
        },
        {
          title: "A turn for the class",
          body: "Activities ask students to listen, point, and answer on the page they are already looking at. Participation is part of the content, not a mode the teacher has to switch into.",
        },
      ],
    },
    {
      id: "features",
      label: "Key features",
      kind: "groups",
      groups: [
        {
          title: "A lesson that stays on the board",
          points: [
            "An ebook opens on the canvas with its name and page count, so a 20-page lesson moves forward without a new layout.",
            "Activities follow the page in reading order: listen, point, and say for letters, numbers, and colors, then ask and answer.",
            "Cards are large enough for a classroom — a letter, a picture, and a word — so students can follow from their seats.",
          ],
        },
        {
          title: "Tools that no longer cover the lesson",
          points: [
            "A left rail holds the moments around the explanation: capture, games, discussion, and a timer.",
            "A bottom bar holds markup: text, pen, shapes, arrows, and stickers, used directly on the page.",
            "A right rail holds utilities: spotlight, eraser, grid, present, pointer, undo, and redo.",
            "The canvas stays open. Choosing a tool does not send the teacher into another screen.",
          ],
        },
        {
          title: "Participation on the same page",
          points: [
            "Prompts such as “Hello. What’s your name?” give students a line to answer out loud or on the board.",
            "Pen, shapes, and stickers let a teacher or a student mark the page without leaving the activity.",
            "Page controls stay at the top of the board, so turning from one activity to the next does not break the class’s place.",
          ],
        },
      ],
    },
    {
      id: "outcome",
      label: "Outcome & Reflection",
      kind: "prose",
      paragraphs: [
        "The decision that held the work together was to stop adding tools and start giving them a place. Once the lesson stayed in the center and everything else moved to the edges, a teacher could point, draw, and turn the page without losing the room.",
        "What I’d carry forward is the line that framed the project: every lesson should create opportunities for participation, not just observation. Usability, in a classroom, is not a cleaner menu. It is whether students are still in the lesson when the teacher reaches for the next tool.",
      ],
    },
  ],
}
