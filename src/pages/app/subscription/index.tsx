import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { ClientMembership } from "@/components/ClientMembership";

const Subscription = () => {
  return (
    <SidebarWithHeader portal={Portal.PROFILE}>
      <ClientMembership />
    </SidebarWithHeader>
  );
};

export default Subscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
