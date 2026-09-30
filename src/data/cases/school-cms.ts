import type { CaseStudy } from "@/data/cases/types"

export const schoolCmsCase: CaseStudy = {
  id: "school-cms",
  title: "School Content Management System",
  href: "/experience?case=school-cms",
  sections: [
    {
      id: "overview",
      label: "Project Overview",
      kind: "overview",
      eyebrow: "Project Insights",
      facts: [
        { label: "My role", value: "Product Designer" },
        { label: "Platform", value: "Web Application" },
        { label: "Target users", value: "School Administrators, Teachers" },
        { label: "Tools", value: "Figma, Jira, Notion" },
      ],
      summary: [
        {
          label: "Description",
          body: "A centralized platform designed to help schools structure their curriculum, manage educational resources, and control how learning materials are distributed.",
        },
        {
          label: "Context",
          body: "School administrators were spending up to 65% of their time manually creating, organizing, and managing learning resources instead of focusing on what matters most: the quality of lessons and the learning experience. Building curricula, adding teaching materials lesson by lesson, and maintaining course content required repetitive manual work.",
        },
      ],
      notes: [
        {
          label: "Motivation",
          body: "The School Content Management System was designed to simplify this process — helping administrators structure curriculum, organize learning resources, and streamline content approval, so they could spend less time managing materials and more time ensuring the quality of learning.",
        },
      ],
      figure: {
        src: "/images/school-cms/overview.png",
        alt: "All Courses page with search, filters, and a grid of kindergarten course cards.",
        caption: "Browse approved courses in a grid, with search, skill, difficulty, and status filters.",
      },
    },
    {
      id: "challenge",
      label: "Challenge",
      kind: "prose",
      paragraphs: [
        "How might we help school administrators build and maintain structured curricula more efficiently, while making educational resources easier to discover, organize, review, and access?",
      ],
    },
    {
      id: "constraints",
      label: "Constraints",
      kind: "prose",
      paragraphs: [
        "The project involved improving existing functionality while preserving its core functionality & introducing a more consistent and modern experience across the platform. The system needed to support complex curriculum structures without overwhelming users, while keeping content organization, editing, and approval workflows clear and predictable.",
      ],
    },
    {
      id: "research",
      label: "Research",
      kind: "research",
      intro: "Understanding the Problem. There are three core problem areas.",
      areas: [
        {
          title: "Curriculum & lesson organization",
          problem:
            "Administrators struggled to change lesson order, manage lesson groups, and move resources between different parts of the curriculum.",
          opportunity:
            "Introduce intuitive drag-and-drop interactions, clear content hierarchy, and flexible create, edit, delete, and copy-paste actions.",
        },
        {
          title: "Learning resource preview",
          problem: "Existing resource details did not provide enough information for users to understand the content before using it.",
          opportunity:
            "Create a more intuitive preview experience that supports quick inspection of multimedia, questions, and resource tags.",
        },
      ],
    },
    {
      id: "vision",
      label: "Defining the Vision",
      kind: "groups",
      groups: [
        {
          title: "From individual resources to a structured learning experience",
          body: "The platform organizes educational content into a hierarchical curriculum structure, allowing administrators to build a course from its overall syllabus down to individual lessons and their associated resources.",
        },
        {
          title: "Start by improving organization with familiar behaviors.",
          body: "Build on patterns users already know in their office work—creating folders, renaming, drag & drop, and navigating a folder tree.",
        },
        {
          title: "From familiar organization to AI-driven creation.",
          body: "Then gradually shift toward an AI-driven approach to creating content.",
        },
      ],
    },
    {
      id: "features",
      label: "Key features",
      kind: "groups",
      groups: [
        {
          title: "Curriculum & lesson organization",
          points: [
            "Enhance content discovery with improved search, filtering, and sorting, and provide Grid and List views for flexible content management.",
            "Improve Curriculum & Lesson Organization with a clear content hierarchy, intuitive drag-and-drop interactions, and flexible create, edit, delete, rename, and copy-paste actions.",
            "Support multiple content types, including eBooks, Lesson Notes, H5P, HTML, References, and Rubrics.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/discovery.png",
                alt: "Annotated curriculum screen showing search, expand and collapse, list and table views, and filters by course, unit, lesson, and content.",
                caption: "Improved search, filtering, and sorting, and provide Grid and List views for flexible content management.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/organize.png",
                alt: "Annotated curriculum screen showing the folder tree, reordering, adding a course, and rename, cut, copy, paste, and delete actions.",
                caption: "Navigate the folder tree, reorder items, and add a course with its own hierarchy of folders and content.",
              },
            },
            {
              layout: "pair",
              figures: [
                {
                  src: "/images/school-cms/lessons.png",
                  alt: "Folder view listing lessons with edit and delete actions.",
                  caption: "Lessons stay in order inside a folder, with edit and delete on each item.",
                },
                {
                  src: "/images/school-cms/lesson-content.png",
                  alt: "Lesson view listing questions, eBooks, notes, rubrics, and references.",
                  caption: "A lesson holds questions, eBooks, notes, rubrics, and references.",
                },
              ],
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/interact.png",
                alt: "Annotated lesson item showing right-click actions and drag-and-drop, view, edit, and delete.",
                caption: "Right-click to cut, copy, paste, rename, or delete, and drag to reorder without leaving the list.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/content-types.png",
                alt: "Add Content menu with eBook, question, lesson notes, H5P, HTML, reference, and rubrics.",
                caption: "Support multiple content types, including eBooks, Lesson Notes, H5P, HTML, References, and Rubrics.",
              },
            },
          ],
        },
        {
          title: "AI-powered content creation & review",
          points: [
            "Introduce AI-powered creation alongside manual creation for Courses and Lessons. Allow users to configure the AI model, skills, and instructions, including what the AI should and should not do, before generating content.",
            "Group generated content by type, such as MCQ (Multiple Choice Questions), Reading, and Audio, with item counts for easier review.",
            "Enable users to regenerate, edit, and approve each content group, with up to two rounds of refinement before finalizing the content.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/ai-generate.png",
                alt: "AI Content Generation screen with module, framework, skills, output types, and can-do statements, plus callouts for module selection, output configuration, and input configuration.",
                caption: "Configure the AI module, skills, output types, and can-do statements before generating course and lesson content.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/ai-review.png",
                alt: "AI Question Bank grouped into MCQ, audio, and reading, with select-all, regenerate, and approve actions across two review rounds.",
                caption: "Review generated MCQ, audio, and reading items by type, then regenerate, edit, or approve across two review rounds.",
              },
            },
          ],
        },
        {
          title: "Learning resource preview",
          points: [
            "Enhance the syllabus overview with key information, including the syllabus name, description, level, number of sections and lessons, and estimated learning hours.",
            "Improve content discovery with search, filtering, and sorting.",
            "Provide a comprehensive resource preview with multimedia content, structured content outlines, and tags to help teachers quickly understand and evaluate learning materials before use.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/cms-feature3-1.png",
                alt: "All Courses grid with level, description, sections, lessons, and hours, plus a multimedia preview of images and video.",
                caption: "Each syllabus shows its name, description, level, sections, lessons, and estimated hours, with a multimedia preview alongside.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/cms-feature3-2.png",
                alt: "Course preview structure tab showing a folder, lessons, and questions.",
                caption: "The structure tab outlines folders, lessons, and questions so teachers can scan the syllabus before opening it.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/school-cms/cms-feature3-3.png",
                alt: "Course preview tag tab with auto tags for level and curriculum, plus skill and manual tags.",
                caption: "Tags for level, curriculum, and skills help teachers judge whether a resource fits before they use it.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "outcome",
      label: "Outcome & Reflection",
      kind: "prose",
      paragraphs: [
        "The key outcome was moving beyond the conventional table layout with collapse/expand rows and exploring a more familiar folder-tree structure for organizing learning content. Testing this approach showed that it made the hierarchy clearer and the overall management experience more intuitive.",
        "What I’d carry forward is how AI shifted our focus from simplifying workflows to rethinking how users interact with them. Creating a lesson is not the difficult part; the real challenge lies in designing a system that suits traditional managers and teachers—professionals whose expertise remains central and who are accustomed to manual lesson planning. The user experience must grant them control from the outset, provide the level of detail needed to review and critique AI-generated content, and offer the editorial freedom to transform the final output into content genuinely their own.",
      ],
    },
  ],
}
