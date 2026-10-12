import type { CaseStudy } from "@/data/cases/types"

export const damCase: CaseStudy = {
  id: "dam",
  title: "Redesign Digital Asset Management for Portfolio Creation at Scale",
  href: "/experience?case=dam",
  sections: [
    {
      id: "overview",
      label: "Project Overview",
      kind: "overview",
      eyebrow: "Project Insights",
      facts: [
        { label: "My role", value: "Product Designer" },
        { label: "Platform", value: "Web Application" },
        {
          label: "Target users",
          value: "Retail crypto traders — from DeFi newcomers to experienced perpetual traders",
        },
        { label: "Tools", value: "Figma, Jira, Notion" },
      ],
      summary: [
        {
          label: "Description",
          body: "Digital Asset Management is a Web3-enabled dashboard that helps users track and manage crypto portfolios across multiple blockchains and centralized exchanges. A portfolio can group multiple wallet addresses and exchange accounts into a single view.",
        },
        {
          label: "Context",
          body: "As the number of wallets grew, the portfolio creation and management experience became increasingly difficult to navigate. Wallets were primarily identified by raw hexadecimal addresses forcing users to mentally map technical identifiers to their real-world purpose. With 10+ wallets, distinguishing them became particularly difficult.",
        },
      ],
      notes: [
        {
          label: "Motivation",
          body: "The goal was to make portfolio management more human-readable and scalable — allowing users to recognize wallets by name, search for them more naturally, and manage larger sets of addresses more efficiently. The redesign introduced Wallet Names, improved search and editing, and extended portfolio creation with bulk CSV import and a structured CSV template.",
        },
      ],
      figure: {
        src: "/images/projects/dam/v3496_10819.png",
        alt: "Portfolio overview for Group A showing net worth, allocation, top wallets, and token holdings.",
        caption: "A portfolio groups wallets and exchange accounts into one view of net worth, allocation, and holdings.",
      },
    },
    {
      id: "challenge",
      label: "Challenge",
      kind: "prose",
      paragraphs: [
        "Wallet addresses are precise and unique, but they are not meaningful identifiers for people. A user might know a wallet as Cold Storage or Trading Wallet. However, the system primarily presented it as 0x1a2b3c...4d5e6f. As portfolios grew, users had to spend more effort interpreting addresses instead of managing their assets.",
        "How might we make portfolio creation and management easier to understand and more efficient at scale, without losing the precision of wallet addresses or breaking the existing logic?",
      ],
    },
    {
      id: "constraints",
      label: "Constraints",
      kind: "prose",
      paragraphs: [
        "The project involved improving existing functionality while preserving its core functionality and introducing a more consistent and modern experience across the platform. The system needed to support large sets of wallet addresses and exchange accounts without overwhelming users, while keeping naming, search, editing, and bulk import clear and predictable.",
      ],
    },
    {
      id: "research",
      label: "Research",
      kind: "research",
      intro: "Two problem areas shaped how portfolios are created and managed.",
      areas: [
        {
          title: "Wallet management in portfolio",
          problem:
            "Wallet addresses are difficult to recognize and remember, especially when a portfolio contains multiple addresses.",
          opportunity:
            "Allow users to assign human-readable names such as Cold Storage or Trading Wallet to make portfolios easier to understand and manage.",
        },
        {
          title: "Portfolio creation at scale",
          problem:
            "As portfolios grow, finding a specific wallet becomes harder, while adding wallets one by one is repetitive and time-consuming.",
          opportunity:
            "Enable users to search by Wallet Name and import multiple wallets through an Excel/CSV sheet, making portfolio management more efficient at scale.",
        },
      ],
    },
    {
      id: "vision",
      label: "Defining the Vision",
      kind: "groups",
      groups: [
        {
          title: "From managing addresses to managing portfolios",
          body: "The vision was to make portfolio management more human-readable, searchable, and scalable without compromising the accuracy of wallet addresses. The redesign focused on three principles.",
        },
        {
          title: "Recognize",
          body: "Give wallets meaningful names so users can identify them by purpose.",
        },
        {
          title: "Find",
          body: "Let users quickly search and locate wallets using their names.",
        },
        {
          title: "Scale",
          body: "Make it easier to manage large portfolios through bulk wallet import.",
        },
      ],
    },
    {
      id: "features",
      label: "Key features",
      kind: "groups",
      groups: [
        {
          title: "Human-readable Wallet Names",
          points: [
            "Introduced a new Name column. Alongside the wallet address and tags, the name becomes the primary human-readable identifier while the original address remains available for technical verification.",
            "Inline editing: rather than opening another modal to rename a wallet, users can click directly into the name cell and edit it inline.",
            "The interaction supports inline text editing, save on blur, save on enter, and validation feedback.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_12923.png",
                alt: "Before redesign: Create Portfolio opens as a popup where a wallet address is entered manually, with no name, tags, or search.",
                caption: "Before: create and edit lived in a popup that only accepted a wallet address, with no name, tags, or search.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_12929.png",
                alt: "After redesign: Create Portfolio is a page with address, name, and tags columns, plus CSV upload and sample download.",
                caption: "After: portfolio creation is a page with wallet names, tags, manual entry, sample download, and bulk import.",
              },
            },
            {
              layout: "pair",
              figures: [
                {
                  src: "/images/projects/dam/v3503_12936.png",
                  alt: "Name field outlined in red with the message that the wallet name already exists.",
                  caption: "Duplicate wallet names are blocked so each name stays unambiguous.",
                },
                {
                  src: "/images/projects/dam/v3503_12939.png",
                  alt: "Tag field outlined in red with the message that the tag was already added.",
                  caption: "Duplicate tags on the same wallet are rejected with inline feedback.",
                },
              ],
            },
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_12932.png",
                alt: "Create Portfolio table with an inline text field open in the Name column.",
                caption: "Click a name cell to edit it inline. Changes save on blur or Enter, with validation in place.",
              },
            },
          ],
        },
        {
          title: "Wallet Name Management",
          points: [
            "Search by wallet name and tags, with matching text highlighted in the table.",
            "Wallet names are validated for length, allowed characters, and duplicates — both within the form and against existing saved names — to prevent ambiguity and provide clear feedback.",
            "Wallet names improve recognition while the full wallet address remains accessible via tooltip and copy actions for verification and accuracy.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3494_7369.png",
                alt: "Create Portfolio with callouts for copying the full address and searching by address, name, or tag.",
                caption: "Copy the full address on demand, and search by address, name, or tag.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_14052.png",
                alt: "Search for 9511 highlights the matching characters inside two wallet addresses.",
                caption: "Matching text is highlighted in the table so the right wallet is easy to spot.",
              },
            },
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_14048.png",
                alt: "Portfolio overview where Top Wallets shows a wallet name, and hovering reveals the full address with a copy action.",
                caption: "The portfolio shows the wallet name by default. Hover reveals the full address and a copy action.",
              },
            },
          ],
        },
        {
          title: "Bulk Portfolio Creation with CSV",
          points: [
            "For users managing a larger number of wallets, manually entering every address can become repetitive. CSV upload lets them prepare multiple wallet records outside the interface and add them in a single operation.",
            "A downloadable CSV template provides that structure before they begin. The template makes the required fields and expected format explicit, reducing uncertainty before upload.",
          ],
          media: [
            {
              layout: "single",
              figure: {
                src: "/images/projects/dam/v3503_14054.png",
                alt: "Create Portfolio with a CSV file dropped onto the address field, plus Upload CSV and Download Sample actions.",
                caption: "Upload or drop a CSV to add many wallets at once, or download a sample that shows the required fields.",
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
        "The most important design decision was recognizing that a wallet address and a wallet name serve fundamentally different purposes. The address provides technical precision. The name provides human context.",
        "Once that distinction was introduced, it became possible to improve more than the visual presentation of the portfolio. It created a foundation for better search, editing, organization, and bulk management.",
        "For a product dealing with increasingly complex digital assets, the goal was to give users a more understandable way to work with that complexity at scale.",
      ],
    },
  ],
}
