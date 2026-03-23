import SummonsPage from "@/components/SummonsComponents/summonsPage";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoutes";
import { PageTransition } from "@/components/motion-primitives";

export default function Chamados() {
  return (
    <>
      <ProtectedRoute roles={["admin"]}>
        <Sidebar />
        <PageTransition>
          <SummonsPage />
        </PageTransition>
      </ProtectedRoute>
    </>
  );
}
