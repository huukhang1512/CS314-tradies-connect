import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { api } from "@/utils/api";
import { Alert, HStack, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const Tradie = () => {
  const { data: providedServicesData } =
    api.services.getUserProvidedServices.useQuery();

  return (
    <SidebarWithHeader portal={Portal.TRADIE}>
      {providedServicesData?.providedServices.length === 0 && (
        <Alert status="warning">
          <HStack align="center" justify="space-between" w={"full"}>
            <Text>
              Heads up! Make sure to add the services that you provided in your
              profile!
            </Text>
            <Link href={"/app/profile"}>
              <IconButton
                variant={"unstyled"}
                aria-label={"edit profile"}
                display={"inline"}
                icon={<FiExternalLink />}
                fontWeight={"semibold"}
              />
            </Link>
          </HStack>
        </Alert>
      )}
    </SidebarWithHeader>
  );
};

export default Tradie;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
