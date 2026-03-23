import ProfilePage from "@/components/ProfileComponents/ProfilePage";
import Sidebar from "@/components/Sidebar";
import { PageTransition } from "@/components/motion-primitives";

export default function Profile() {
  return (
    <>
      <Sidebar />
      <PageTransition>
        <ProfilePage />
      </PageTransition>
    </>
  );
}
