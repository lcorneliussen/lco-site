export type Project = {
  name: string;
  href: string;
  description: string;
  label: string;
};

export const projects: Project[] = [
  {
    name: "taba.sh",
    href: "https://taba.sh",
    label: "Open source · creator",
    description:
      "Git worktree collections for work that spans repositories, agents, and environments. One workspace per task.",
  },
  {
    name: "jenda.run",
    href: "https://jenda.run",
    label: "Product · builder",
    description:
      "A shared, understandable view of time-based workflows — built to make complex processes easier to run together.",
  },
  {
    name: "weeks.app",
    href: "https://about.weeks.app",
    label: "Product · creator",
    description:
      "Staff scheduling for the messy parts of real operations, with an API and agent-friendly command-line tools.",
  },
  {
    name: "kaessli.app",
    href: "https://kaessli.app",
    label: "Product · builder",
    description:
      "A focused application for shared money, clear records, and less administrative friction.",
  },
  {
    name: "OMS Prüfservice",
    href: "https://oms-pruefservice.de",
    label: "Long-term engagement",
    description:
      "Digital platforms and technology work for electrical safety at scale across Germany.",
  },
  {
    name: "whoo",
    href: "https://whoo.ai",
    label: "Client work · via Raskenlund",
    description:
      "Product and platform work at the intersection of applied AI, customer experience, and operations.",
  },
  {
    name: "Talendos",
    href: "https://talendos.com",
    label: "Company · founder",
    description:
      "My consultancy and investment company, centred on digital business platforms and durable partnerships.",
  },
  {
    name: "Faktum Faktura",
    href: "https://www.faktumfaktura.de",
    label: "Product · partner",
    description:
      "Straightforward invoicing software for small businesses, including e-invoices and local-first data.",
  },
  {
    name: "CC Billing",
    href: "https://virksomhet.brreg.no/nb/oppslag/enheter/930221856",
    label: "Company · partner",
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
