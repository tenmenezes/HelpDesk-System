import MySummonsPage from "@/components/MySummonsComponents/mySummonsPage";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";

export default function MySummons() {
  return (
    <>
      <ProtectedRoute roles={["comum"]}>
        <Sidebar />
        <MySummonsPage />
      </ProtectedRoute>
    </>
  );
}
