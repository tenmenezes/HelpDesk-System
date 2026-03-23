import IssuesPage from "@/components/IssuesComponents/issuesPage";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import { PageTransition } from "@/components/motion-primitives";

export default function Problemas() {
  return (
    <>
      <ProtectedRoute roles={["admin", "suporte"]}>
        <Sidebar />
        <PageTransition>
          <IssuesPage />
        </PageTransition>
      </ProtectedRoute>
    </>
  );
}
