import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { getServerSideProps as redirect } from "@/pages/app";
export const getServerSideProps = redirect;

const Tradie = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.TRADIE}></SidebarWithHeader>
    </>
  );
};
export default Tradie;
