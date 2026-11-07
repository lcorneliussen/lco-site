export type Project = {
  name: string;
  href: string;
  description: string;
  label: string;
  mark: string;
  image?: string;
  tone: "forest" | "blue" | "amber" | "plum" | "graphite";
};

export const projects: Project[] = [
  {
    name: "taba.sh",
    href: "https://taba.sh",
    label: "AI tooling",
    mark: ">_",
    image: "project-screens/taba.webp",
    tone: "graphite",
    description:
      "Git worktree collections for work that spans repositories, agents, and environments. One workspace per task.",
  },
  {
    name: "weeks.app",
    href: "https://about.weeks.app",
    label: "Shift planning",
    mark: "W",
    image: "project-screens/weeks.webp",
    tone: "forest",
    description:
      "Staff scheduling for the messy parts of real operations, with an API and agent-friendly command-line tools.",
  },
  {
    name: "kaessli.app",
    href: "https://kaessli.app",
    label: "Budgets and Inventory",
    mark: "K",
    tone: "amber",
    description:
      "A focused application for shared money, clear records, and less administrative friction.",
  },
  {
    name: "jenda.run",
    href: "https://jenda.run",
    label: "Agendas and Rundowns",
    mark: "↻",
    image: "project-screens/jenda.webp",
    tone: "blue",
    description:
      "A shared, understandable view of time-based workflows — built to make complex processes easier to run together.",
  },
  {
    name: "OMS Prüfservice",
    href: "https://oms-pruefservice.de",
    label: "Consultant / Data Lead",
    mark: "Ω",
    image: "project-screens/oms.webp",
    tone: "blue",
    description:
      "Digital platforms and technology work for electrical safety at scale across Germany.",
  },
  {
    name: "whoo",
    href: "https://whoo.ai",
    label: "Cloud-based Intercoms",
    mark: "◎",
    image: "project-screens/whoo.webp",
    tone: "plum",
    description:
      "Through Talendos: product and platform work where applied AI, customer experience, and operations meet.",
  },
  {
    name: "Talendos",
    href: "https://talendos.com",
    label: "Emerging values",
    mark: "T",
    image: "project-screens/talendos.webp",
    tone: "forest",
    description:
      "My consultancy and investment company, centred on digital business platforms and durable partnerships.",
  },
  {
    name: "Faktum Faktura",
    href: "https://www.faktumfaktura.de",
    label: "Co-owner",
    mark: "F",
    image: "project-screens/faktum-faktura.webp",
    tone: "amber",
    description:
      "Straightforward invoicing software for small businesses, including e-invoices and local-first data.",
  },
  {
    name: "CC Billing",
    href: "https://www.carecloud.de/",
    label: "Co-owner",
    mark: "CC",
    image: "project-screens/carecloud.webp",
    tone: "blue",
    description:
      "Billing software for residential elderly care, connected to the wider CareCloud platform for care documentation and operations.",
  },
  {
    name: "revans.ai",
    href: "https://revans.ai/",
    label: "Angel investor",
    mark: "R",
    image: "project-screens/revans.webp",
    tone: "plum",
    description:
      "Feedback operations software that turns reviews and surveys into visible patterns and measurable improvements.",
  },
];

export const interests = [
  {
    name: "omacontrib",
    kind: "Open source",
    mark: "OC",
    href: "https://github.com/lcorneliussen/omacontrib",
    primaryLabel: "GitHub",
    image: "interest-screens/omacontrib.webp",
    description:
      "An Omarchy bar plugin that follows upstream contributions until the fix lands locally.",
  },
  {
    name: "omaego",
    kind: "Open source",
    mark: "OE",
    href: "https://github.com/lcorneliussen/omaego",
    image: "interest-screens/omaego.webp",
    description:
      "Context-separated browser identities, workspace-aware routing, and web apps for Omarchy.",
  },
  {
    name: "md365",
    kind: "Open source",
    mark: "M365",
    href: "https://github.com/lcorneliussen/md365",
    image: "interest-screens/md365.webp",
    description:
      "An AI-native Microsoft 365 CLI that makes mail, calendars, contacts, Teams, and files agent-friendly.",
  },
  {
    name: "Omarchy",
    kind: "Contribution",
    mark: "O",
    href: "https://omarchy.org",
    image: "interest-screens/omarchy.webp",
    description:
      "A beautiful, modern, opinionated Linux environment — and a community I contribute to.",
  },
  {
    name: "Omacom / Hype",
    kind: "Contribution",
    mark: "H",
    href: "https://github.com/omacom/hype",
    image: "interest-screens/hype.webp",
    secondaryHref: "https://github.com/lcorneliussen/hype",
    secondaryLabel: "my fork",
    description: "Simple Markdown presentations with a visual slide editor.",
  },
];
