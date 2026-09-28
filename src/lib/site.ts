export const site = {
  name: "MODUS",
  legalName: "MODUS — Arquitetura & Construção",
  tagline: "Construímos espaços para viver.",
  description:
    "A MODUS projeta e constrói casas contemporâneas de alto padrão em Portugal. Arquitetura, engenharia e execução rigorosa — espaços pensados para durar.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://modus.pt",
  email: "geral@modus.pt",
  phone: "+351 239 000 000",
  phoneHref: "+351239000000",
  address: {
    street: "Rua da Sofia 142",
    city: "Coimbra",
    postalCode: "3000-389",
    country: "Portugal",
  },
  social: {
    instagram: "https://instagram.com/modus.construcao",
    linkedin: "https://linkedin.com/company/modus-construcao",
  },
  nav: [
    { label: "A empresa", href: "/empresa" },
    { label: "Projetos", href: "/projetos" },
    { label: "Serviços", href: "/servicos" },
    { label: "Etapas", href: "/#processo" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export const OG_IMAGE = "/images/proj-lumen.webp";
