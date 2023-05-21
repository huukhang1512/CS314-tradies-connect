import { ClientMembership } from "@/components/MembershipCard/ClientMembership";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";

const ClientSubscription = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.CLIENT}>
        <ClientMembership />
      </SidebarWithHeader>
    </>
  );
};

export default ClientSubscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
