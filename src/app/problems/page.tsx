import IssuesPage from "@/components/IssuesComponents/issuesPage";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";

export default function Problemas() {
  return (
    <>
      <ProtectedRoute roles={["admin", "suporte"]}>
        <Sidebar />
        <IssuesPage />
      </ProtectedRoute>
    </>
  );
}