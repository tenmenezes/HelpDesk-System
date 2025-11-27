
const API = `${process.env.NEXT_PUBLIC_API_URL}/routes/chamados`;

export async function getUserChamados(id_usuario: number) {
  const res = await fetch(`${API}/getUser.php?id_usuario=${id_usuario}`);

  if (!res) {
    return console.log("Dados invalidos");
  }

  return res.json();
}

export async function getAllChamados() {
  const res = await fetch(`${API}/read_all.php`);
  return res.json();
}

export async function insertChamado(data: any) {
  return fetch(`${API}/insert.php`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateChamado(data: any) {
  return fetch(`${API}/routes/chamados/edit.php`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteChamado(id: number) {
  return fetch(`${API}/routes/chamados/delete.php?id_chamado=${id}`, {
    method: "DELETE",
  });
}
