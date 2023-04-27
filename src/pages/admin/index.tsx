import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";

const Admin = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.ADMIN}></SidebarWithHeader>
    </>
  );
};

export default Admin;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
