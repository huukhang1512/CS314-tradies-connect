import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable, { type RowAction } from "@/components/Table";
import Rating from "@/components/Rating";
import { api } from "@/utils/api";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Tag,
  TagLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { BsCheckCircle, BsInfoCircle, BsStar } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { MembershipType, RequestStatus } from "@prisma/client";
import { type CellProps, type Column } from "react-table";
import { CloseIcon } from "@chakra-ui/icons";
import { type FormikValues, useFormik } from "formik";
import markAsCompleted from "@/assets/markAsCompleted.png";
import { type Request } from "@prisma/client";
import { type AcceptProposalInputType } from "@/server/api/routers/proposal";
import { type CreateRatingInputType } from "@/server/api/routers/rating";
import { PaymentReportGenerationButton } from "@/components/PaymentReportGenerationButton";
const renderDate: React.FC<CellProps<Request, Date>> = (cell) => {
  return <>{cell.value.toLocaleString("en-AU")}</>;
};

const renderStatus: React.FC<CellProps<Request, RequestStatus>> = (cell) => {
  switch (cell.value) {
    case RequestStatus.IN_PROGRESS:
      return (
        <>
          <Tag size="md" colorScheme="blue" borderRadius="full">
            <TagLabel>In Progress</TagLabel>
          </Tag>
        </>
      );
    case RequestStatus.CANCELLED:
      return (
        <>
          <Tag size="md" colorScheme="red" borderRadius="full">
            <TagLabel>Cancelled</TagLabel>
          </Tag>
        </>
      );
    case RequestStatus.COMPLETED:
      return (
        <>
          <Tag size="md" colorScheme="green" borderRadius="full">
            <TagLabel>Done</TagLabel>
          </Tag>
        </>
      );
    case RequestStatus.BROADCASTED:
      return (
        <>
          <Tag size="md" colorScheme="yellow" borderRadius="full">
            <TagLabel>Waiting for responders</TagLabel>
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

type RespondersPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  request?: Request;
  onSubmit: (responder: AcceptProposalInputType) => Promise<void>;
};

const RespondersPopUp = (props: RespondersPopUpProps) => {
  const { isOpen, onClose, request } = props;

  if (request) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent p={3}>
          <HStack alignItems={"center"} justify={"space-between"} p={3}>
            <ModalHeader whiteSpace={"nowrap"} p={0}>
              Responders
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
            <VStack spacing={3}></VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
};

type MarkAsCompletePopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<any>;
};

const MarkAsCompletePopUp = (props: MarkAsCompletePopUpProps) => {
  const { isOpen, onClose, onSubmit } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent p={3}>
        <HStack alignItems={"center"} justify={"space-between"} p={3}>
          <ModalHeader whiteSpace={"nowrap"} p={0}>
            Mark as completed
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
            <Image src={markAsCompleted.src} alt={"Mark as completed"} />
            <Text fontSize={"sm"} color={"gray"}>
              By clicking this button, you confirm that the service has been
              completed
            </Text>
            <Button
              variant={"primary"}
              w={"full"}
              type={"submit"}
              onClick={() => void onSubmit()}
            >
              Confirm
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type RatingPopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateRatingInputType) => Promise<any>;
  request?: Request;
};

const RatingPopup = (props: RatingPopUpProps) => {
  const { isOpen, onClose, onSubmit, request } = props;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rating: 5,
      comment: "",
      requestId: request?.id || "",
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  if (request) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent p={3}>
          <HStack alignItems={"center"} justify={"space-between"} p={3}>
            <ModalHeader whiteSpace={"nowrap"} p={0}>
              Rating
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
              Request ID: <b>{request.id}</b> | Created date:{" "}
              <b>{request.createdAt.toLocaleDateString("en-AU")}</b>
            </Text>
          </HStack>
          <ModalBody p={3}>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>
                    What do you think about the service provider and their
                    services ?
                  </FormLabel>
                  <Rating
                    size={48}
                    name={"rating"}
                    onChange={(value) =>
                      void formik.setFieldValue("rating", value)
                    }
                    value={formik.values.rating}
                    maxRating={5}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Review</FormLabel>
                  <Textarea
                    id={"comment"}
                    name={"comment"}
                    placeholder={"Write your feedback"}
                    h={300}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.comment}
                  />
                </FormControl>
                <Button variant={"primary"} w={"full"} type={"submit"}>
                  Submit
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  return <></>;
};

interface InputType extends FormikValues {
  serviceName: string;
  description: string;
  unit: number;
  id: string;
}

type RequestPopupProps = {
  isOpen: boolean;
  mode?: "update" | "create";
  request?: Request;
  onClose: () => void;
  onSubmit: (values: InputType) => Promise<void>;
  onCancel?: (id) => void;
};

const RequestPopup = ({
  isOpen,
  mode = "create",
  request,
  onClose,
  onSubmit,
  onCancel,
}: RequestPopupProps) => {
  const { data: services } = api.services.getServices.useQuery();
  const { data: activeMembership } =
    api.memberships.getUserActiveMembership.useQuery();

  const initialValues = useMemo<InputType>(() => {
    if (mode === "update" && request !== undefined) {
      return {
        serviceName: request.serviceName,
        description: request.description,
        unit: request.unit,
        id: request.id,
      };
    } else {
      return {
        serviceName: services?.at(0)?.name || "",
        description: "",
        unit: 1,
        id: "",
      };
    }
  }, [mode, request, services]);

  const formik = useFormik<InputType>({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const getServiceFromName = useCallback(
    (serviceName: string) =>
      services?.find((service) => service.name === serviceName),
    [services]
  );

  const hasClientMembership = () => {
    const currentClientMembership = activeMembership?.filter(
      (mem) => mem.membership.type === MembershipType.CLIENT
    );
    if (request)
      return currentClientMembership?.some(
        (mem) => mem.createdAt < request.createdAt // request made before membership or not
      );
    return currentClientMembership?.length !== 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent p={3}>
        <HStack alignItems={"center"} justify={"space-between"} p={3}>
          <ModalHeader whiteSpace={"nowrap"} p={0}>
            {mode === "create" ? "Make service request" : "Payment details"}
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
        {mode === "update" && (
          <HStack alignItems={"center"} justify={"space-between"} paddingX={3}>
            <Text fontSize={"sm"} color={"gray"}>
              Request ID: <b>{request?.id}</b> | Created date:{" "}
              <b>{request?.createdAt.toLocaleString("en-AU")}</b>
            </Text>
          </HStack>
        )}
        <ModalBody p={3}>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Service</FormLabel>
                <Select
                  id={"serviceName"}
                  name={"serviceName"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                  value={formik.values.serviceName}
                >
                  {services?.map((service) => (
                    <option key={mode + service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Quantity</FormLabel>
                <InputGroup>
                  <InputLeftAddon>
                    {getServiceFromName(formik.values.serviceName)?.unit}
                  </InputLeftAddon>
                  <Input
                    id={"unit"}
                    type={"number"}
                    name={"unit"}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.unit}
                  />
                </InputGroup>
                <FormHelperText>
                  {getServiceFromName(formik.values.serviceName)?.description}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  id={"description"}
                  name={"description"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                  value={formik.values.description}
                  h={300}
                />
              </FormControl>
              <HStack w={"full"} justify={"space-between"}>
                <Text>Total price:</Text>
                <Text fontWeight={"bold"}>
                  {hasClientMembership()
                    ? "Free"
                    : `$${
                        (getServiceFromName(formik.values.serviceName)?.rate ||
                          1) * formik.values.unit
                      }`}
                </Text>
              </HStack>
              {(mode === "create" ||
                request?.status == RequestStatus.BROADCASTED ||
                request?.status == RequestStatus.IN_PROGRESS) && (
                <Button variant={"primary"} w={"full"} type={"submit"}>
                  {mode === "create" ? "Submit" : "Edit"}
                </Button>
              )}
              {mode === "update" &&
                onCancel &&
                (request?.status == RequestStatus.BROADCASTED ||
                  request?.status == RequestStatus.IN_PROGRESS) && (
                  <Button
                    variant={"outline"}
                    w={"full"}
                    onClick={() => onCancel(request?.id)}
                  >
                    Cancel Request
                  </Button>
                )}
              {request?.status === RequestStatus.COMPLETED && (
                <PaymentReportGenerationButton request={request} />
              )}
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Client = () => {
  const { mutateAsync: getRequests } =
    api.requests.getRequestsByUser.useMutation();
  const { mutateAsync: createRequest } =
    api.requests.createRequest.useMutation();
  const { mutateAsync: updateRequest } =
    api.requests.updateRequest.useMutation();
  const { mutateAsync: cancelRequest } =
    api.requests.cancelRequest.useMutation();
  const { mutateAsync: completeJob } = api.jobs.completeJob.useMutation();
  const { mutateAsync: rateProvider } = api.rating.createRating.useMutation();
  const { mutateAsync: acceptProposal } =
    api.proposals.acceptProposal.useMutation();
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [openResponders, setOpenResponders] = useState(false);

  const [forceRefetch, setForceRefetch] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request>();
  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      setForceRefetch(false);
      return await getRequests({ page, perPage });
    },
    [getRequests]
  );
  const columns = useMemo<Column<Request>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "SERVICE",
        accessor: "serviceName",
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: renderStatus,
      },
      {
        Header: "ISSUE",
        accessor: "description",
      },
      {
        Header: "UNIT",
        accessor: "unit",
      },
      {
        Header: "PRICE",
        accessor: "price",
      },
      {
        Header: "CREATED DATE",
        accessor: "createdAt",
        Cell: renderDate,
      },
    ],
    []
  );

  const rowActions: RowAction<Request>[] = [
    {
      actionName: "View details",
      icon: <BsInfoCircle />,
      callback: (row) => {
        setSelectedRequest(row);
        setOpenUpdate(true);
      },
    },
    {
      actionName: "Mark as completed",
      icon: <BsCheckCircle />,
      callback: (row) => {
        setSelectedRequest(row);
        setOpenComplete(true);
      },
      shouldRender: (row) => row.status === RequestStatus.IN_PROGRESS,
    },
    {
      actionName: "See responders",
      icon: <AiOutlineMessage />,
      callback: (row) => setSelectedRequest(row),
      shouldRender: (row) => row.status === RequestStatus.BROADCASTED,
    },
    {
      actionName: "Rating",
      icon: <BsStar />,
      callback: (row) => {
        setSelectedRequest(row);
        setOpenRating(true);
      },
      shouldRender: (row) => row.status === RequestStatus.COMPLETED,
    },
  ];
  return (
    <>
      <RequestPopup
        key={"create"}
        mode="create"
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={async (values) => {
          await createRequest(values);
          setOpenCreate(false);
          setForceRefetch(true);
        }}
      />
      <RequestPopup
        key={"update"}
        mode="update"
        isOpen={openUpdate}
        request={selectedRequest}
        onClose={() => setOpenUpdate(false)}
        onSubmit={async (values) => {
          await updateRequest(values);
          setOpenUpdate(false);
          setForceRefetch(true);
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onCancel={async (id: string) => {
          await cancelRequest({ id });
          setOpenUpdate(false);
          setForceRefetch(true);
        }}
      />
      <MarkAsCompletePopUp
        isOpen={openComplete}
        onClose={() => setOpenComplete(false)}
        onSubmit={async () => {
          await completeJob({ id: selectedRequest?.id || "" });
          setOpenComplete(false);
          setForceRefetch(true);
        }}
      />
      <RatingPopup
        isOpen={openRating}
        onClose={() => setOpenRating(false)}
        onSubmit={async (values: CreateRatingInputType) => {
          await rateProvider(values);
          setOpenRating(false);
          setForceRefetch(true);
        }}
        request={selectedRequest}
      />
      <RespondersPopUp
        isOpen={openResponders}
        onClose={() => setOpenResponders(false)}
        request={selectedRequest}
        onSubmit={async (responder: AcceptProposalInputType) => {
          await acceptProposal({
            requestId: selectedRequest?.id || "",
            responderId: responder.responderId,
          });
          setOpenResponders(false);
          setForceRefetch(true);
        }}
      />
      <SidebarWithHeader portal={Portal.CLIENT}>
        <VStack bg={"white"} rounded={"md"} p={5} spacing={5} w={"full"}>
          <HStack justify={"space-between"} w={"full"}>
            <Heading size={"md"}>Request table</Heading>
            <Button
              variant={"primary"}
              onClick={() => {
                setSelectedRequest(undefined);
                setOpenCreate(true);
              }}
            >
              Add new request
            </Button>
          </HStack>
          <CustomTable
            getData={getData}
            columns={columns}
            actions={rowActions}
            refetchState={forceRefetch}
          />
        </VStack>
      </SidebarWithHeader>
    </>
  );
};

export default Client;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
