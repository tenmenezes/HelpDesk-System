const API = `${process.env.NEXT_PUBLIC_API_URL}/routes/chamados`;

export async function getUserChamados(id_usuario: number) {
  const res = await fetch(`${API}/getUser.php?id_usuario=${id_usuario}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar chamados");
  }

  return res.json();
}

export async function getAllChamados() {
  const res = await fetch(`${API}/read_all.php`);

  if (!res.ok) {
    throw new Error("Erro ao buscar chamados");
  }

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
  const res = await fetch(`${API}/insert.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const res = await fetch(`${API}/edit.php`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteChamado(id: number) {
  const res = await fetch(`${API}/delete.php?id_chamado=${id}`, {
    method: "DELETE",
  });

  return res.json();
}
