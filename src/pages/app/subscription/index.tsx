import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { ClientMembership } from "@/components/MembershipCard/ClientMembership";
import { TradieMembership } from "@/components/MembershipCard/TradieMembership";
import { VStack } from "@chakra-ui/react";

const Subscription = () => {
  return (
    <SidebarWithHeader portal={Portal.PROFILE}>
      <VStack spacing={5}>
        <ClientMembership />
        <TradieMembership />
      </VStack>
    </SidebarWithHeader>
  );
};

export default Subscription;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
