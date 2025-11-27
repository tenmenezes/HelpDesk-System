export const fetchChamados = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes/chamados/read.php`
  );
  return res.json();
};

export const fetchChamadosByUser = async (id_usuario: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes/chamados/getUser.php?id=${id_usuario}`
  );
  return res.json();
};
