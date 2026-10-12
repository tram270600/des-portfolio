export type Certificate = {
  id: string
  title: string
  description: string
  href: string
  frame: string
  artwork: string
  accent: string
}

export const certificates: Certificate[] = [
  {
    id: "accessibility",
    title: "Accessibility Foundations",
    description: "The bearer of this certificate has completed the Accessibility Foundations course",
    href: "https://app.uxcel.com/certificates/NL49STWIL4TH",
    frame: "/images/certificate/frame1.png",
    artwork: "/images/certificate/Accessibility.png",
    accent: "#00b078",
  },
  {
    id: "designathon",
    title: "Designathon Competition 2024",
    description:
      "In recognition of outstanding commitment and creativity during the Lollypop Designathon 2024",
    href: "https://lollypop.design/designathon-2024/",
    frame: "/images/certificate/frame2.png",
    artwork: "/images/certificate/Designathon.png",
    accent: "#f86048",
  },
  {
    id: "user-psychology",
    title: "User Psychology",
    description: "The bearer of this certificate has completed the User Psychology course",
    href: "https://app.uxcel.com/certificates/XOUJO7P2S2QC",
    frame: "/images/certificate/frame3.png",
    artwork: "/images/certificate/UserPsychology.png",
    accent: "#0068d0",
  },
]

export const restingCertificateId = certificates[1].id
