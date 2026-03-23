import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import UsersPage from "@/components/usersComponents/UsersPage";
import { PageTransition } from "@/components/motion-primitives";

export default function Usuarios() {
  return (
    <>
      <ProtectedRoute roles={["admin"]}>
        <Sidebar />
        <PageTransition>
          <UsersPage />
        </PageTransition>
      </ProtectedRoute>
    </>
  );
}
