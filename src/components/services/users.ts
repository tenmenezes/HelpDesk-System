// Serviço de usuários — API interna Next.js (migrado de PHP)

export async function getUsers() {
  const res = await fetch(`/api/usuarios`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
}
