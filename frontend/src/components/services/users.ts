export async function getUsers() {
  const res = await fetch(
    "http://localhost:8000/routes/usuarios/read.php",
    {
      cache: "no-store",
    }
  );

  return res.json();
}
