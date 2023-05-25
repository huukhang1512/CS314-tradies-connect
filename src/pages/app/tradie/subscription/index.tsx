import { TradieMembership } from "@/components/MembershipCard/TradieMembership";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { api } from "@/utils/api";
import { VStack } from "@chakra-ui/react";

const ClientSubscription = () => {
  const {
    isLoading,
    data: activeMemberships,
    refetch,
  } = api.memberships.getUserActiveMembership.useQuery();
  return (
    <>
      <SidebarWithHeader portal={Portal.TRADIE}>
        <VStack spacing={5}>
          {!isLoading && activeMemberships && (
            <TradieMembership
              refetch={refetch}
              activeMemberships={activeMemberships}
            />
          )}
        </VStack>
      </SidebarWithHeader>
    </>
  );
};

export default ClientSubscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
