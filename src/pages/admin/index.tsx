import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.ADMIN}>
        <UserManagement />
      </SidebarWithHeader>
    </>
  );
};

export default Admin;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
