import { useIssues } from "./useIssues";
import { useMyChamados } from "./useMyTickets";

export function useSyncChamados(id_usuario: number) {
  const { mutate: mutateIssues } = useIssues();
  const { mutate: mutateMyChamados } = useMyChamados(id_usuario);

  return () => {
    mutateIssues();
    mutateMyChamados();
  };
}
