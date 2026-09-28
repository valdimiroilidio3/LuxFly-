import type { Database } from "./types";

/**
 * DEMO CONTENT — substituível na totalidade através de /admin.
 * Nenhum componente depende destes valores em concreto: tudo é lido do store.
 */
export const seed: Database = {
  projects: [
    {
      id: "prj-lumen",
      index: "01",
      slug: "casa-lumen",
      title: "Casa LUMEN",
      category: "Moradia contemporânea",
      location: "Coimbra",
      year: "2025",
      area: "320 m²",
      status: "Concluído",
      excerpt:
        "Uma casa organizada em torno da luz: dois volumes horizontais que abrem para sul e um pátio de água que devolve o céu ao interior.",
      description: [
        "A Casa LUMEN nasce de uma pergunta simples feita pelos clientes: como viver com mais luz sem perder privacidade. A resposta foi separar a casa em dois volumes — um social, aberto ao jardim, outro íntimo, protegido por uma pala profunda de betão.",
        "Trabalhámos betão aparente moldado in situ, cantaria de granito local e carpintaria em carvalho maciço. As caixilharias de correr com 3,2 metros de altura desaparecem por completo na parede, dissolvendo o limite entre sala e exterior.",
        "A obra foi executada em 14 meses com equipa própria em estrutura e acabamentos, com controlo semanal de custo e prazo partilhado com o cliente.",
      ],
      cover: "/images/proj-lumen.webp",
      gallery: ["/images/proj-lumen.webp", "/images/detail-macro.webp", "/images/proj-aurea.webp"],
      featured: true,
      published: true,
      span: "wide",
      createdAt: "2025-02-11T09:00:00.000Z",
    },
    {
      id: "prj-norte",
      index: "02",
      slug: "casa-norte",
      title: "Casa NORTE",
      category: "Residencial privado",
      location: "Porto",
      year: "2024",
      area: "245 m²",
      status: "Concluído",
      excerpt:
        "Granito escuro, betão e madeira. Uma casa fechada à rua e totalmente aberta ao pátio interior, desenhada para a luz do Norte.",
      description: [
        "Num lote estreito e comprido, a Casa NORTE responde com uma fachada discreta, quase silenciosa, e uma vida interior intensa organizada à volta de um pátio com uma única árvore.",
        "A escolha dos materiais parte do lugar: granito da região em fachada, betão à vista nas zonas de circulação e ripado vertical de madeira termotratada nos vãos.",
        "O projeto foi desenvolvido em conjunto com a equipa de arquitetura desde o estudo prévio, o que permitiu antecipar pormenor construtivo e reduzir alterações em obra.",
      ],
      cover: "/images/proj-norte.webp",
      gallery: ["/images/proj-norte.webp", "/images/detail-macro.webp"],
      featured: true,
      published: true,
      span: "tall",
      createdAt: "2024-09-04T09:00:00.000Z",
    },
    {
      id: "prj-aurea",
      index: "03",
      slug: "casa-aurea",
      title: "Casa ÁUREA",
      category: "Moradia de luxo",
      location: "Lisboa",
      year: "2025",
      area: "410 m²",
      status: "Em obra",
      excerpt:
        "Travertino, sombra e água. Um volume suspenso sobre o terraço que protege do sol de verão e enquadra a cidade ao fundo.",
      description: [
        "A Casa ÁUREA trabalha a sombra como material. O piso superior avança cinco metros sobre o terraço e cria uma zona de estar exterior utilizável todo o ano.",
        "O revestimento em travertino romano foi selecionado bloco a bloco em pedreira, com juntas alinhadas em todo o alçado — um detalhe invisível para quem passa e determinante para quem vive a casa.",
        "Em execução, com conclusão prevista para o final de 2026.",
      ],
      cover: "/images/proj-aurea.webp",
      gallery: ["/images/proj-aurea.webp", "/images/detail-macro.webp"],
      featured: true,
      published: true,
      span: "regular",
      createdAt: "2025-05-20T09:00:00.000Z",
    },
    {
      id: "prj-vela",
      index: "04",
      slug: "casa-vela",
      title: "Casa VELA",
      category: "Arquitetura residencial",
      location: "Cascais",
      year: "2023",
      area: "280 m²",
      status: "Concluído",
      excerpt:
        "Volumes brancos, lâminas de teca e o horizonte como única decoração. Uma casa desenhada para o vento e para a luz do Atlântico.",
      description: [
        "A proximidade ao mar impôs decisões técnicas exigentes: caixilharia de classe reforçada, ferragens em inox marítimo e um sistema de sombreamento em teca capaz de resistir à salinidade sem manutenção pesada.",
        "O interior foi reduzido ao essencial — reboco areado branco, pavimento contínuo e carpintaria à medida — para que a paisagem ocupe o primeiro plano.",
        "Entregue em 2023, continua em acompanhamento pós-obra pela equipa MODUS.",
      ],
      cover: "/images/proj-vela.webp",
      gallery: ["/images/proj-vela.webp", "/images/detail-macro.webp"],
      featured: true,
      published: true,
      span: "offset",
      createdAt: "2023-11-15T09:00:00.000Z",
    },
  ],
  services: [
    {
      id: "svc-01",
      index: "01",
      title: "Construção",
      description: "Execução integral de moradias e edifícios, da fundação à chave na mão.",
      image: "/images/proj-lumen.webp",
      detail: [
        "Estrutura, envolvente, especialidades e acabamentos com equipa própria nas fases críticas.",
        "Planeamento semanal, controlo de custo por capítulo e relatório fotográfico de obra.",
      ],
      published: true,
    },
    {
      id: "svc-02",
      index: "02",
      title: "Reabilitação",
      description: "Intervenção em construção existente com respeito pela pré-existência.",
      image: "/images/proj-norte.webp",
      detail: [
        "Levantamento rigoroso, diagnóstico estrutural e reforço quando necessário.",
        "Melhoria de desempenho térmico e acústico sem descaracterizar o edifício.",
      ],
      published: true,
    },
    {
      id: "svc-03",
      index: "03",
      title: "Arquitetura",
      description: "Projeto desenhado à medida do terreno, do orçamento e de quem vai viver.",
      image: "/images/proj-aurea.webp",
      detail: [
        "Estudo prévio, licenciamento e projeto de execução com pormenor construtivo desenhado.",
        "Coordenação com todas as especialidades desde o primeiro traço.",
      ],
      published: true,
    },
    {
      id: "svc-04",
      index: "04",
      title: "Gestão de obra",
      description: "Coordenação de equipas, prazos, fornecedores e custo real.",
      image: "/images/proj-vela.webp",
      detail: [
        "Um interlocutor único para o cliente durante toda a empreitada.",
        "Mapa de trabalhos atualizado e autos de medição transparentes.",
      ],
      published: true,
    },
    {
      id: "svc-05",
      index: "05",
      title: "Interiores",
      description: "Carpintaria à medida, materiais e luz pensados em conjunto com a obra.",
      image: "/images/detail-macro.webp",
      detail: [
        "Desenho de mobiliário fixo, seleção de pedra, madeira e metal.",
        "Projeto de iluminação integrado na fase de execução, sem improvisos finais.",
      ],
      published: true,
    },
    {
      id: "svc-06",
      index: "06",
      title: "Consultoria",
      description: "Avaliação de viabilidade, custo e risco antes de avançar.",
      image: "/images/proj-lumen.webp",
      detail: [
        "Análise de terreno, índices urbanísticos e estimativa de custo em fase inicial.",
        "Segunda opinião técnica sobre projetos e propostas já existentes.",
      ],
      published: true,
    },
  ],
  testimonials: [
    {
      id: "tst-01",
      quote:
        "A MODUS conseguiu transformar uma ideia em uma casa que realmente sentimos nossa.",
      author: "Marta e Rui Almeida",
      role: "Cliente particular",
      project: "Casa LUMEN",
      published: true,
    },
    {
      id: "tst-02",
      quote:
        "Houve rigor do primeiro orçamento à última visita. Sabíamos sempre em que ponto estava a obra e quanto tinha custado.",
      author: "Pedro Sequeira",
      role: "Cliente particular",
      project: "Casa NORTE",
      published: true,
    },
    {
      id: "tst-03",
      quote:
        "Discutimos pormenores que nunca imaginei discutir numa obra. É esse cuidado que se vê todos os dias em casa.",
      author: "Inês Carvalho",
      role: "Cliente particular",
      project: "Casa VELA",
      published: true,
    },
  ],
  stats: [
    { id: "st-01", value: 25, prefix: "+", suffix: "", label: "Projetos realizados", published: true },
    { id: "st-02", value: 10, prefix: "+", suffix: "", label: "Anos de experiência", published: true },
    { id: "st-03", value: 100, prefix: "", suffix: "%", label: "Compromisso", published: true },
    { id: "st-04", value: 1, prefix: "", suffix: "", label: "Equipa multidisciplinar", published: true },
  ],
  quotes: [
    {
      id: "qt-demo-1",
      name: "Sofia Marques",
      email: "sofia.marques@exemplo.pt",
      phone: "+351 912 000 111",
      projectType: "Moradia",
      location: "Aveiro",
      budget: "300.000 € — 600.000 €",
      message:
        "Temos um terreno de 800 m² e gostaríamos de perceber a viabilidade de uma moradia térrea com pátio interior.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      status: "Novo",
    },
    {
      id: "qt-demo-2",
      name: "João Ferreira",
      email: "joao.ferreira@exemplo.pt",
      phone: "+351 933 222 444",
      projectType: "Reabilitação",
      location: "Porto",
      budget: "150.000 € — 300.000 €",
      message: "Edifício de 1940 para reabilitar por completo, dois pisos mais sótão.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
      status: "Em análise",
    },
  ],
  settings: {
    companyName: "MODUS",
    tagline: "Construímos espaços para viver.",
    email: "geral@modus.pt",
    phone: "+351 239 000 000",
    address: "Rua da Sofia 142, 3000-389 Coimbra",
    instagram: "https://instagram.com/modus.construcao",
    linkedin: "https://linkedin.com/company/modus-construcao",
    responseTime: "Resposta inicial em até 1 dia útil.",
  },
};

export const processSteps = [
  {
    id: "ps-01",
    index: "01",
    title: "Conversa",
    description:
      "Ouvimos a ideia, o terreno e o orçamento real. Sem compromisso e sem linguagem técnica desnecessária.",
  },
  {
    id: "ps-02",
    index: "02",
    title: "Conceito",
    description:
      "Traduzimos o programa em volumes, luz e materiais. Primeiras hipóteses desenhadas e discutidas.",
  },
  {
    id: "ps-03",
    index: "03",
    title: "Projeto",
    description:
      "Arquitetura e especialidades desenvolvidas em conjunto, até ao pormenor construtivo e licenciamento.",
  },
  {
    id: "ps-04",
    index: "04",
    title: "Planeamento",
    description:
      "Mapa de trabalhos, cronograma e orçamento fechado por capítulo. O que está previsto é o que é executado.",
  },
  {
    id: "ps-05",
    index: "05",
    title: "Construção",
    description:
      "Obra com direção técnica permanente, controlo de qualidade e relatório semanal enviado ao cliente.",
  },
  {
    id: "ps-06",
    index: "06",
    title: "Entrega",
    description:
      "Vistoria conjunta, manual da casa e acompanhamento pós-obra. A relação não termina na chave.",
  },
];
