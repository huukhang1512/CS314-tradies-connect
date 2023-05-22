import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { ClientMembership } from "@/components/MembershipCard/ClientMembership";
import { TradieMembership } from "@/components/MembershipCard/TradieMembership";
import { VStack } from "@chakra-ui/react";
import { api } from "@/utils/api";

const Subscription = () => {
  const { data: activeMemberships } =
    api.memberships.getUserActiveMembership.useQuery();

  if (!activeMemberships) return <>Loading...</>;
  return (
    <SidebarWithHeader portal={Portal.PROFILE}>
      <VStack spacing={5}>
        <ClientMembership activeMemberships={activeMemberships} />
        <TradieMembership activeMemberships={activeMemberships} />
      </VStack>
    </SidebarWithHeader>
  );
};

export default Subscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
