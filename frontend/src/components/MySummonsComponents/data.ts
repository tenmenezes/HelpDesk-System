export type Issue = {
  id_chamado: number;
  titulo: string;
  usuario: string;
  setor: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  criado_em: string; // ISO date string
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "example1@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example2@gmail.com",
  },
  {
    id: "586ygo77m",
    amount: 167,
    status: "success",
    email: "example3@gmail.com",
  },
  {
    id: "200men18y",
    amount: 190,
    status: "failed",
    email: "example4@gmail.com",
  },
];
