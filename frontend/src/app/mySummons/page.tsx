import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";

export default function MySummons() {
  return (
    <>
      <ProtectedRoute roles={["comum"]}>
        <Sidebar />
        <div>
          <h1>Pagina de meus chamados</h1>
        </div>
      </ProtectedRoute>
    </>
  );
}
