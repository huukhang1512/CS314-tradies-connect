import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";

const Tradie = () => {
  return (
    <SidebarWithHeader portal={Portal.TRADIE}>
      <h1>Tradie Home</h1>
    </SidebarWithHeader>
  );
};

export default Tradie;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
