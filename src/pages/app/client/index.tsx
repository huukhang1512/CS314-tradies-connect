import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";

const Client = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.CLIENT}></SidebarWithHeader>
    </>
  );
};

export default Client;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
