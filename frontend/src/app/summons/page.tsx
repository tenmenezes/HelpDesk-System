import SummonsPage from "@/components/summonsComponents/summonsPage";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function Chamados() {
  return (
    <>
      <ProtectedRoute roles={["admin"]}>
        <Sidebar />
        <SummonsPage />
      </ProtectedRoute>
    </>
  );
}