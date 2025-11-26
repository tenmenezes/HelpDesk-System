import ProtectedRoute from "@/components/ProtectedRoutes"

export default function MySummons() {
    return (
      <>
        <ProtectedRoute roles={["comum"]}>
          <div>
            <h1>Meus chamados</h1>
          </div>
        </ProtectedRoute>
      </>
    );
}