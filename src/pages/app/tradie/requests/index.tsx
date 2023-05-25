import { RequestCard } from "@/components/RequestCard";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { api } from "@/utils/api";
import {
  Alert,
  Avatar,
  Button,
  Card,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { useState, useEffect } from "react";
import { type RequestWithClient } from "@/server/api/routers/request";
import { CloseIcon } from "@chakra-ui/icons";

type RequestDetailsPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  request?: RequestWithClient;
  onSubmit: (id: string) => Promise<any>;
};

const RequestDetailsPopUp = (props: RequestDetailsPopUpProps) => {
  const { isOpen, onClose, request, onSubmit } = props;
  if (request) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent p={3}>
          <HStack alignItems={"center"} justify={"space-between"} p={3}>
            <ModalHeader whiteSpace={"nowrap"} p={0}>
              Request details
            </ModalHeader>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => onClose()}
              size={"xs"}
              borderColor={"gray"}
              borderWidth={2}
              p={0}
              aria-label={"Close modal"}
              isRound
              variant={"ghost"}
            />
          </HStack>
          <ModalBody p={3}>
            <VStack spacing={3}>
              <Card p={3} w={"full"} variant={"outline"}>
                <VStack spacing={3}>
                  <HStack w={"full"} spacing={4}>
                    <Avatar
                      size={"lg"}
                      display={{ base: "none", md: "flex" }}
                      src={request.client.image || undefined}
                      title={request.client.name || undefined}
                    />
                    <VStack alignItems={"flex-start"} spacing={1} w={"full"}>
                      <Text fontSize={"lg"} fontWeight={"semibold"}>
                        {request.client.name}
                      </Text>
                      <Text fontSize={"xs"} color={"text.secondary"}>
                        Request ID: <b>{request.id}</b> | Created date:{" "}
                        <b>{request?.createdAt.toLocaleDateString("en-AU")}</b>
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <Text>Service:</Text>
                    <Text fontWeight={"bold"}>{request.serviceName}</Text>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <Text>Quantity:</Text>
                    <Text fontWeight={"bold"}>{request.unit}</Text>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <Text>Location:</Text>
                    <Text
                      textAlign={"right"}
                      fontSize={"sm"}
                      fontWeight={"bold"}
                    >
                      {request.client.address}
                    </Text>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <Text>Issue:</Text>
                    <Text
                      textAlign={"right"}
                      fontSize={"sm"}
                      fontWeight={"bold"}
                    >
                      {request.description}
                    </Text>
                  </HStack>
                  <HStack w={"full"} justifyContent={"space-between"}>
                    <Text>Price:</Text>
                    <Text fontWeight={"bold"}>${request.price}</Text>
                  </HStack>
                </VStack>
              </Card>
              <Button
                variant={"primary"}
                w={"full"}
                type={"submit"}
                onClick={() => void onSubmit(request.id)}
              >
                Accept
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
};

const Request = () => {
  const { data: providedServicesData } =
    api.services.getUserProvidedServices.useQuery();
  const { mutateAsync: getRequestsByService } =
    api.requests.getRequestsByService.useMutation();
  const { mutateAsync: createProposal } =
    api.proposals.createProposal.useMutation();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithClient>();
  const [requests, setRequests] = useState<RequestWithClient[]>([]);
  const [refetch, setRefetch] = useState(true);
  useEffect(() => {
    const fetchRequests = async () => {
      const result = await getRequestsByService({
        serviceNames:
          providedServicesData?.providedServices.map((s) => s.name) || [],
      });
      setRequests(result);
      setRefetch(false);
    };
    if (refetch) {
      void fetchRequests();
    }
  }, [providedServicesData, getRequestsByService, refetch]);
  return (
    <>
      <RequestDetailsPopUp
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        request={selectedRequest}
        onSubmit={async (requestId: string) => {
          await createProposal({ requestId });
          setOpenCreate(false);
          setRefetch(true);
        }}
      />
      <SidebarWithHeader portal={Portal.TRADIE}>
        {providedServicesData?.providedServices.length === 0 && (
          <Alert status="warning">
            <HStack align="center" justify="space-between" w={"full"}>
              <Text>
                Heads up! Make sure to add the services that you provided in
                your profile!
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
        <Card
          p={5}
          variant={"outline"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => {
                setSelectedRequest(request);
                setOpenCreate(true);
              }}
            />
          ))}
        </Card>
      </SidebarWithHeader>
    </>
  );
};

export default Request;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
