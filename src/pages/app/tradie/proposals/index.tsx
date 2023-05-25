import SidebarWithHeader, { Portal } from "@/components/SidebarWithHeader";
import CustomTable, { RowAction } from "@/components/Table";
import { ProposalWithRequestAndJob } from "@/server/api/routers/proposal";
import { api } from "@/utils/api";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Proposal, ProposalStatus } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { BsInfoCircle, BsStar } from "react-icons/bs";
import { GiRoundStar } from "react-icons/gi";
import { CellProps, Column } from "react-table";

type DetailPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  proposalId?: string;
  onSubmit: (id: string) => Promise<any>;
};

const DetailPopUp = (props: DetailPopUpProps) => {
  const { isOpen, onClose, proposalId, onSubmit } = props;
  const { data: proposal } = api.proposals.getProposalById.useQuery({
    id: proposalId || "",
  });
  console.log(proposal);
  if (!proposal) return <></>;
  return (
    <Modal scrollBehavior={"inside"} isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent p={3}>
        <HStack alignItems={"center"} justify={"space-between"} p={3}>
          <ModalHeader whiteSpace={"nowrap"} p={0}>
            Proposal details
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
        <HStack alignItems={"center"} justify={"space-between"} paddingX={3}>
          <Text fontSize={"sm"} color={"gray"}>
            Proposal ID: <b>{proposal.id}</b>
          </Text>
        </HStack>
        <ModalBody p={3}>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel>Client</FormLabel>
              <Input
                value={proposal.request.client.name || 0}
                isDisabled
                color="black"
              />
            </FormControl>
            {proposal.status === ProposalStatus.ACCEPTED && (
              <FormControl>
                <FormLabel>Contact number</FormLabel>
                <Input
                  value={proposal.request.client.phoneNumber || ""}
                  isDisabled
                  color="black"
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Service</FormLabel>
              <Input
                value={proposal.request.serviceName}
                isDisabled
                color="black"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Textarea
                value={proposal.request.address || ""}
                isDisabled
                color="black"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={proposal.request.description || ""}
                isDisabled
                color="black"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                value={proposal.request.price || 0}
                isDisabled
                color="black"
              />
            </FormControl>
            {proposal.job && (
              <>
                <FormControl>
                  <FormLabel>Job accepted date</FormLabel>
                  <Input
                    value={proposal.job.startedDate.toLocaleDateString("en-AU")}
                    isDisabled
                    color="black"
                  />
                </FormControl>
                {proposal.job.finishedDate ? (
                  <FormControl>
                    <FormLabel>Job finished date</FormLabel>
                    <Input
                      value={proposal.job.finishedDate.toLocaleDateString(
                        "en-AU"
                      )}
                      isDisabled
                      color="black"
                    />
                  </FormControl>
                ) : (
                  <FormControl>
                    <FormLabel>Job status</FormLabel>
                    <Input value={"In Progress"} isDisabled color="black" />
                  </FormControl>
                )}
                {proposal.job.review.length > 0 && proposal.job.review.map((r) => (<>
                  <FormControl>
                    <FormLabel>Review</FormLabel>
                    <HStack flexDir={"row"}>
                      <Text>{r.rating}</Text>
                      <GiRoundStar size={"20px"} color={"#FFDB5E"} />
                    </HStack>
                    <Textarea value={r.comment} isDisabled color="black" />
                  </FormControl>
                </>))
                }
              </>
            )}
            {proposal.status === ProposalStatus.NEW && (
              <Button
                variant={"primary"}
                w={"full"}
                type={"submit"}
                onClick={() => void onSubmit(proposal.id)}
              >
                Cancel proposal
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const renderStatus: React.FC<
  CellProps<ProposalWithRequestAndJob, ProposalStatus>
> = (cell) => {
  switch (cell.value) {
    case ProposalStatus.NEW:
      return (
        <>
          <Tag size="md" colorScheme="yellow" borderRadius="full">
            <TagLabel>Waiting for client</TagLabel>
          </Tag>
        </>
      );
    case ProposalStatus.CANCELLED:
      return (
        <>
          <Tag size="md" colorScheme="red" borderRadius="full">
            <TagLabel>Cancelled</TagLabel>
          </Tag>
        </>
      );
    case ProposalStatus.ACCEPTED:
      return (
        <>
          <Tag size="md" colorScheme="green" borderRadius="full">
            <TagLabel>Accepted</TagLabel>
          </Tag>
        </>
      );
    case ProposalStatus.REJECTED:
      return (
        <>
          <Tag size="md" colorScheme="purple" borderRadius="full">
            <TagLabel>Rejected</TagLabel>
          </Tag>
        </>
      );
    default:
      return (
        <>
          <Tag size="md" colorScheme="gray" borderRadius="full">
            <TagLabel>Unknown</TagLabel>
          </Tag>
        </>
      );
  }
};

const Proposals = () => {
  const { mutateAsync: getProposals } =
    api.proposals.getProposalsByUser.useMutation();
  const { mutateAsync: cancelProposal } =
    api.proposals.cancelProposal.useMutation();
  const [forceRefetch, setForceRefetch] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<string>();
  const [openDetail, setOpenDetail] = useState(false);
  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      setForceRefetch(false);
      return await getProposals({ page, perPage });
    },
    [getProposals]
  );

  const columns = useMemo<Column<ProposalWithRequestAndJob>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "SERVICE",
        accessor: (row) => row.request.serviceName,
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: renderStatus,
      },
      {
        Header: "ISSUE",
        accessor: (row) => row.request.description,
      },
      {
        Header: "PRICE",
        accessor: (row) => row.request.price,
      },
    ],
    []
  );

  const rowActions: RowAction<ProposalWithRequestAndJob>[] = [
    {
      actionName: "View details",
      icon: <BsInfoCircle />,
      callback: (row) => {
        setSelectedProposal(row.id);
        setOpenDetail(true);
      },
    },
  ];

  return (
    <>
      <DetailPopUp
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        proposalId={selectedProposal}
        onSubmit={async (id) => {
          await cancelProposal(id);
          setOpenDetail(false);
          setForceRefetch(true);
        }}
      />
      <SidebarWithHeader portal={Portal.TRADIE}>
        <VStack bg={"white"} rounded={"md"} p={5} spacing={5} w={"full"}>
          <HStack justify={"space-between"} w={"full"}>
            <Heading size={"md"}>Request table</Heading>
          </HStack>
          <CustomTable
            getData={getData}
            columns={columns}
            actions={rowActions}
            refetchState={forceRefetch}
          />
        </VStack>
      </SidebarWithHeader>
      ;
    </>
  );
};

export default Proposals;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
