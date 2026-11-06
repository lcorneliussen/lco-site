export type Project = {
  name: string;
  href: string;
  description: string;
  label: string;
  mark: string;
  tone: "forest" | "blue" | "amber" | "plum" | "graphite";
};

export const projects: Project[] = [
  {
    name: "taba.sh",
    href: "https://taba.sh",
    label: "Open source · creator",
    mark: ">_",
    tone: "graphite",
    description:
      "Git worktree collections for work that spans repositories, agents, and environments. One workspace per task.",
  },
  {
    name: "jenda.run",
    href: "https://jenda.run",
    label: "Product · builder",
    mark: "↻",
    tone: "blue",
    description:
      "A shared, understandable view of time-based workflows — built to make complex processes easier to run together.",
  },
  {
    name: "weeks.app",
    href: "https://about.weeks.app",
    label: "Product · creator",
    mark: "W",
    tone: "forest",
    description:
      "Staff scheduling for the messy parts of real operations, with an API and agent-friendly command-line tools.",
  },
  {
    name: "kaessli.app",
    href: "https://kaessli.app",
    label: "Product · builder",
    mark: "K",
    tone: "amber",
    description:
      "A focused application for shared money, clear records, and less administrative friction.",
  },
  {
    name: "OMS Prüfservice",
    href: "https://oms-pruefservice.de",
    label: "Long-term engagement",
    mark: "Ω",
    tone: "blue",
    description:
      "Digital platforms and technology work for electrical safety at scale across Germany.",
  },
  {
    name: "whoo",
    href: "https://whoo.ai",
    label: "Client work · via Talendos",
    mark: "◎",
    tone: "plum",
    description:
      "Through Talendos: product and platform work where applied AI, customer experience, and operations meet.",
  },
  {
    name: "Talendos",
    href: "https://talendos.com",
    label: "Company · founder",
    mark: "T",
    tone: "forest",
    description:
      "My consultancy and investment company, centred on digital business platforms and durable partnerships.",
  },
  {
    name: "Faktum Faktura",
    href: "https://www.faktumfaktura.de",
    label: "Product · partner",
    mark: "F",
    tone: "amber",
    description:
      "Straightforward invoicing software for small businesses, including e-invoices and local-first data.",
  },
  {
    name: "CC Billing",
    href: "https://virksomhet.brreg.no/nb/oppslag/enheter/930221856",
    label: "Company · partner",
    mark: "CC",
    tone: "graphite",
    description:
      "Norwegian software company working on practical billing and business administration products.",
  },
];

export const interests = [
  {
    name: "Omarchy",
    href: "https://omarchy.org",
    description:
      "A beautiful, modern, opinionated Linux environment — and a community I contribute to.",
  },
  {
    name: "Omacom / Hype",
    href: "https://github.com/omacom/hype",
    secondaryHref: "https://github.com/lcorneliussen/hype",
    secondaryLabel: "my fork",
    description: "Simple Markdown presentations with a visual slide editor.",
  },
  {
    name: "OmaContrib",
    href: "https://github.com/lcorneliussen/omacontrib",
    description:
      "An Omarchy bar plugin that follows upstream contributions until the fix lands locally.",
  },
  {
    name: "OmaEgo",
    href: "https://github.com/lcorneliussen/omaego",
    description:
      "Context-separated browser identities, workspace-aware routing, and web apps for Omarchy.",
  },
];
