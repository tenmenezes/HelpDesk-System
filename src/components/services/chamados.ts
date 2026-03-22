// Serviço de chamados — API interna Next.js (migrado de PHP)

export async function getUserChamados(id_usuario: number) {
  const res = await fetch(`/api/chamados/user/${id_usuario}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar chamados");
  return res.json();
}

export async function getAllChamados() {
  const res = await fetch(`/api/chamados`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar chamados");
  return res.json();
}

export async function insertChamado(data: {
  id_usuario: number;
  id_setor: number;
  titulo: string;
  descricao: string;
  status?: string;
  prioridade?: string;
}) {
  const res = await fetch(`/api/chamados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateChamado(data: {
  id_chamado: number;
  status?: string;
  prioridade?: string;
  titulo?: string;
  descricao?: string;
}) {
  const { id_chamado, ...rest } = data;
  const res = await fetch(`/api/chamados/${id_chamado}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  return res.json();
}

export async function deleteChamado(id: number) {
  const res = await fetch(`/api/chamados/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
