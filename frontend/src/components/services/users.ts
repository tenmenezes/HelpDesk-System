import { toast } from "sonner";

export async function getUsers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/read.php`,
    {
      cache: "no-store",
    },
  );
  
  if (!res) {
    toast.error("Falha ao realizar fetch, dados não salvos na varável 'res' em users.ts 'getUsers'.")
  }

  return res.json();
}
