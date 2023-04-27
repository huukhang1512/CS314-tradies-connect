import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { getServerSideProps as redirect } from "@/pages/app";
export const getServerSideProps = redirect;

const Client = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.CLIENT}></SidebarWithHeader>
    </>
  );
};
export default Client;
