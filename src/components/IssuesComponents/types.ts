export type Issue = {
  id_chamado: number;
  titulo: string;
  descricao: string;
  status: "aberto" | "andamento" | "resolvido" | "cancelado";
  prioridade: "baixa" | "media" | "alta";
  criado_em: string;
  atualizado_em: string;
  id_setor: number;
  setor_nome: string;
  id_usuario: number;
  usuario_nome: string;
  usuario_foto: string;
  usuario_foto_url: string | null;
};
