import type { CaseStudy } from "@/data/cases/types"

export const smartSiteSafetySystemCase: CaseStudy = {
  id: "smart-site-safety-system",
  title: "Smart Site Safety System",
  href: "/experience?case=smart-site-safety-system",
  sections: [
    {
      id: "overview",
      label: "Project Overview",
      kind: "overview",
      eyebrow: "Project Insights",
      facts: [
        { label: "My role", value: "Product Designer" },
        { label: "Platform", value: "Website" },
        { label: "Target users", value: "Construction Admin and Workers" },
        { label: "Tools", value: "Figma, Jira, Notion" },
      ],
      summary: [
        {
          label: "Description",
          body: "Empower Your Jobsites with Automated Construction Management Software Powered with AI Video Analytics",
        },
        {
          label: "Context",
          body: "Construction companies are facing a significant challenge in managing and tracking safety data across their sites. The existing site safety system felt outdated, with tools scattered across the interface, leading to “friction-heavy” lessons where workers lost focus while admins struggled to navigate complex menu systems.",
        },
      ],
      notes: [
        {
          label: "Motivation",
          body: "Improving usability and accessibility to boost worker engagement in construction sites. This project transforms a fragmented toolset into a cohesive site safety experience.",
        },
      ],
      figure: {
        src: "/images/projects/dam/viact-thumbnail.png",
        alt: "Construction worker on a jobsite beside the Smart Site Safety System website.",
        caption: "Construction worker on a jobsite beside the Smart Site Safety System website.",
      },
    },
    {
      id: "figma",
      label: "Solution",
      kind: "figma",
      isFullScreen: false,
      embedUrl: "https://embed.figma.com/proto/z2xPzKl5o6L0zF1p1h5YGY/Tram-Nguyen---Product-Designer-Resume?page-id=0%3A1&node-id=312-6314&recovery=true&viewport=538%2C136%2C0.26&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=312%3A6314&embed-host=share",
    },
  ],
}