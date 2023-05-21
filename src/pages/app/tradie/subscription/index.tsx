import { TradieMembership } from "@/components/MembershipCard/TradieMembership";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";

const ClientSubscription = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.TRADIE}>
        <TradieMembership />
      </SidebarWithHeader>
    </>
  );
};

export default ClientSubscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
