import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import UsersPage from "@/components/usersComponents/UsersPage";

export default function Usuarios() {
  return (
    <>
      <ProtectedRoute roles={["admin"]}>
        <Sidebar />
        <UsersPage />
      </ProtectedRoute>
    </>
  );
}
