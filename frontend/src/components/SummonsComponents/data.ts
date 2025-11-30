type Summon = {
  titulo: string;
  usuario: {
    nome: string;
    foto: string;
  };
  setor: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  criado_em: string; // ISO date string
};

export const summons: Summon[] = [
  {
    titulo: "Sistema travando ao iniciar",
    usuario: { nome: "Ana Santos", foto: "https://i.pravatar.cc/150?img=47" },
    setor: "Tecnologia",
    status: "aberto",
    prioridade: "alta",
    criado_em: "2025-01-12 09:45:00",
  },
  {
    titulo: "Solicitação de criação de e-mail",
    usuario: {
      nome: "Carlos Andrade",
      foto: "https://i.pravatar.cc/150?img=12",
    },
    setor: "RH",
    status: "andamento",
    prioridade: "media",
    criado_em: "2025-01-10 14:12:00",
  },
  {
    titulo: "Falha ao imprimir relatórios",
    usuario: {
      nome: "Juliana Ribeiro",
      foto: "https://i.pravatar.cc/150?img=29",
    },
    setor: "Financeiro",
    status: "resolvido",
    prioridade: "baixa",
    criado_em: "2025-01-09 16:40:00",
  },
  {
    titulo: "Acesso negado ao sistema interno",
    usuario: {
      nome: "Diego Martins",
      foto: "https://i.pravatar.cc/150?img=52",
    },
    setor: "Tecnologia",
    status: "cancelado",
    prioridade: "alta",
    criado_em: "2025-01-08 11:21:00",
  },
  {
    titulo: "Erro ao salvar formulário",
    usuario: {
      nome: "Mariana Alves",
      foto: "https://i.pravatar.cc/150?img=33",
    },
    setor: "Administrativo",
    status: "aberto",
    prioridade: "media",
    criado_em: "2025-01-07 10:10:00",
  },
  {
    titulo: "Computador não liga",
    usuario: { nome: "Rafael Gomes", foto: "https://i.pravatar.cc/150?img=15" },
    setor: "Tecnologia",
    status: "andamento",
    prioridade: "alta",
    criado_em: "2025-01-06 08:22:00",
  },
  {
    titulo: "Erro de autenticação no sistema",
    usuario: {
      nome: "Beatriz Costa",
      foto: "https://i.pravatar.cc/150?img=18",
    },
    setor: "Financeiro",
    status: "aberto",
    prioridade: "alta",
    criado_em: "2025-01-05 11:30:00",
  },
  {
    titulo: "Solicitação de ajuste de permissão",
    usuario: { nome: "Lucas Mendes", foto: "https://i.pravatar.cc/150?img=7" },
    setor: "Tecnologia",
    status: "resolvido",
    prioridade: "baixa",
    criado_em: "2025-01-04 15:17:00",
  },
  {
    titulo: "Problema com acesso ao Wi-Fi",
    usuario: {
      nome: "Fernanda Souza",
      foto: "https://i.pravatar.cc/150?img=23",
    },
    setor: "RH",
    status: "aberto",
    prioridade: "media",
    criado_em: "2025-01-03 09:50:00",
  },
  {
    titulo: "Monitor piscando",
    usuario: {
      nome: "Gabriel Rocha",
      foto: "https://i.pravatar.cc/150?img=41",
    },
    setor: "Administrativo",
    status: "andamento",
    prioridade: "baixa",
    criado_em: "2025-01-02 13:25:00",
  },
  {
    titulo: "Erro ao gerar relatório mensal",
    usuario: {
      nome: "Patrícia Almeida",
      foto: "https://i.pravatar.cc/150?img=56",
    },
    setor: "Financeiro",
    status: "aberto",
    prioridade: "alta",
    criado_em: "2025-01-01 16:45:00",
  },
  {
    titulo: "Teclado não funciona",
    usuario: { nome: "João Silva", foto: "https://i.pravatar.cc/150?img=3" },
    setor: "Tecnologia",
    status: "cancelado",
    prioridade: "media",
    criado_em: "2024-12-30 11:12:00",
  },
  {
    titulo: "Problemas no acesso ao e-mail corporativo",
    usuario: { nome: "Larissa Dias", foto: "https://i.pravatar.cc/150?img=25" },
    setor: "RH",
    status: "aberto",
    prioridade: "alta",
    criado_em: "2024-12-29 08:30:00",
  },
  {
    titulo: "Impressora sem conexão",
    usuario: {
      nome: "Eduardo Barros",
      foto: "https://i.pravatar.cc/150?img=40",
    },
    setor: "Administrativo",
    status: "resolvido",
    prioridade: "media",
    criado_em: "2024-12-28 15:40:00",
  },
  {
    titulo: "Sistema fechando sozinho",
    usuario: {
      nome: "Camila Borges",
      foto: "https://i.pravatar.cc/150?img=30",
    },
    setor: "Tecnologia",
    status: "andamento",
    prioridade: "alta",
    criado_em: "2024-12-27 13:00:00",
  },
  {
    titulo: "Solicitação de acesso ao portal interno",
    usuario: {
      nome: "Thiago Pereira",
      foto: "https://i.pravatar.cc/150?img=8",
    },
    setor: "Financeiro",
    status: "aberto",
    prioridade: "baixa",
    criado_em: "2024-12-26 10:28:00",
  },
  {
    titulo: "Erro ao atualizar cadastro",
    usuario: { nome: "Bruna Leite", foto: "https://i.pravatar.cc/150?img=27" },
    setor: "RH",
    status: "andamento",
    prioridade: "media",
    criado_em: "2024-12-25 09:00:00",
  },
  {
    titulo: "Janela travando ao abrir gráficos",
    usuario: {
      nome: "Henrique Farias",
      foto: "https://i.pravatar.cc/150?img=10",
    },
    setor: "Financeiro",
    status: "aberto",
    prioridade: "alta",
    criado_em: "2024-12-24 17:55:00",
  },
  {
    titulo: "Computador reiniciando sozinho",
    usuario: {
      nome: "Isabela Martins",
      foto: "https://i.pravatar.cc/150?img=54",
    },
    setor: "Tecnologia",
    status: "resolvido",
    prioridade: "alta",
    criado_em: "2024-12-23 12:10:00",
  },
  {
    titulo: "Queda de desempenho no sistema",
    usuario: { nome: "Fábio Cunha", foto: "https://i.pravatar.cc/150?img=16" },
    setor: "Administrativo",
    status: "aberto",
    prioridade: "media",
    criado_em: "2024-12-22 08:42:00",
  },
];
