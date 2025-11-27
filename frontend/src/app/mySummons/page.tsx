import ProtectedRoute from "@/components/ProtectedRoutes";
import Sidebar from "@/components/Sidebar";
import MySummonsPage from "@/components/MySummonsComponents/mySummonsPage";

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
