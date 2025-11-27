export interface Chamado {
  id_chamado: number;
  id_usuario: number;
  titulo: string;
  descricao: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  setor: string | null;
  criado_em: string;
  atualizado_em: string;
}
