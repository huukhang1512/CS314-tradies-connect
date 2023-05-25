import { ClientMembership } from "@/components/MembershipCard/ClientMembership";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { api } from "@/utils/api";
import { VStack } from "@chakra-ui/react";

const ClientSubscription = () => {
  const { data: activeMemberships, refetch } =
    api.memberships.getUserActiveMembership.useQuery();

  if (!activeMemberships) return <>Loading...</>;
  return (
    <>
      <SidebarWithHeader portal={Portal.CLIENT}>
        <VStack spacing={5}>
          <ClientMembership
            refetch={refetch}
            activeMemberships={activeMemberships}
          />
        </VStack>
      </SidebarWithHeader>
    </>
  );
};

export default ClientSubscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
