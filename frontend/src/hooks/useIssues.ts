import useSWR from "swr";
import { getAllChamados } from "@/components/services/chamados";

export function useIssues() {
  const { data, isLoading, mutate } = useSWR("issues", getAllChamados);

  return { issues: data || [], isLoading, mutate };
}
