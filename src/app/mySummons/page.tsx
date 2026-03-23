import MySummonsPage from "@/components/MySummonsComponents/mySummonsPage";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import { PageTransition } from "@/components/motion-primitives";

export default function MySummons() {
  return (
    <>
      <ProtectedRoute roles={["comum"]}>
        <Sidebar />
        <PageTransition>
          <MySummonsPage />
        </PageTransition>
      </ProtectedRoute>
    </>
  );
}
