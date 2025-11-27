import useSWR from "swr";
import { fetchChamadosByUser } from "@/components/MySummonsComponents/fetcher";

export function useMyChamados(id_usuario: number | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id_usuario ? `chamados-user-${id_usuario}` : null,
    () => fetchChamadosByUser(Number(id_usuario))
  );

  return {
    chamados: data || [],
    isLoading,
    mutate,
    error,
  };
}
