import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable, { RowAction } from "@/components/Table";
import Rating from "@/components/Rating";
import { api } from "@/utils/api";
import {
  Button,
  FormControl,
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
import { Request } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsCheckCircle, BsInfoCircle, BsStar } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { RequestStatus } from "@prisma/client";
import { CellProps } from "react-table";
import { CloseIcon } from "@chakra-ui/icons";
import { FormikValues, useFormik } from "formik";
import {
  CreateRequestInputType,
  UpdateRequestInputType,
} from "@/server/api/routers/request";
import markAsCompleted from "@/assets/markAsCompleted.png";
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
  onSubmit: (responder) => Promise<void>;
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
          <VStack spacing={3}>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>

    )
  }
  return <></>
}

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
              onClick={() => onSubmit()}
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
  onSubmit: (values) => Promise<any>;
  request?: Request;
};

const RatingPopup = (props: RatingPopUpProps) => {
  const { isOpen, onClose, onSubmit, request } = props;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rating: 5,
      comment: "",
    },
    onSubmit: async (values) => {
      const valuesWithRequest = { ...values, requestId: request?.id}
      await onSubmit(valuesWithRequest);
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
          <HStack
              alignItems={"center"}
              justify={"space-between"}
              paddingX={3}
            >
              <Text fontSize={"sm"} color={"gray"}>
                Request ID: <b>{request.id}</b> | Created date:{" "}
                <b>{request.createdAt.toLocaleDateString("en-AU")}</b>
              </Text>
            </HStack>
          <ModalBody p={3}>

            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>What do you think about the service provider and their services ?</FormLabel>
                  <Rating
                    size={48}
                    name={"rating"}
                    onChange={(value) => formik.setFieldValue("rating", value)}
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
                <Button
                  variant={"primary"}
                  w={"full"}
                  type={"submit"}
                >
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
  id?: string;
}

type RequestPopupProps<T> = {
  isOpen: boolean;
  mode?: "update" | "create";
  request?: Request;
  onClose: () => void;
  onSubmit: (values: T) => Promise<void>;
  onCancel?: (id) => void;
};

const RequestPopup = <T extends InputType>({
  isOpen,
  mode = "create",
  request,
  onClose,
  onSubmit,
  onCancel,
}: RequestPopupProps<T>) => {
  let { data: services } = api.services.getServices.useQuery();
  useEffect(() => {
    if (services === undefined) {
      services = [];
    } else if (services !== undefined && services.length > 0) {
      let defaultService = "";
      if (services !== undefined && services.length > 0) {
        defaultService = services[0]?.name || "";
      }
      formik.setFieldValue("serviceName", defaultService);
    }
  }, [services]);

  const initialValues = useMemo(() => {
    let initialValues;
    if (mode === "update" && request !== undefined) {
      initialValues = {
        serviceName: request.serviceName,
        description: request.description,
        unit: request.unit,
        id: request.id,
      };
    } else {
      initialValues = {
        serviceName: "",
        description: "",
        unit: 0,
      };
    }
    return initialValues;
  }, [mode, request]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

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
                <FormLabel>Unit</FormLabel>
                <InputGroup>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    id={"unit"}
                    name={"unit"}
                    type={"number"}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.unit}
                  />
                </InputGroup>
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
              {( mode === "create" ||
              request?.status == RequestStatus.BROADCASTED || 
              request?.status == RequestStatus.IN_PROGRESS) && (
                <Button variant={"primary"} w={"full"} type={"submit"}>
                  {mode === "create" ? "Submit" : "Edit"}
                </Button>
              )}
              {mode === "update" && onCancel 
              && (request?.status == RequestStatus.BROADCASTED 
              || request?.status == RequestStatus.IN_PROGRESS) && (
                <Button variant={"outline"} w={"full"} onClick={() => onCancel(request?.id)}>
                  Cancel Request
                </Button>
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
  const { mutateAsync: completeJob } =
    api.jobs.completeJob.useMutation();
  const { mutateAsync: rateProvider } = 
    api.rating.createRating.useMutation();
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
  const columns = useMemo(
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
      <RequestPopup<CreateRequestInputType>
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
      <RequestPopup<UpdateRequestInputType>
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
        onCancel={async (id) => {
          await cancelRequest({ id });
          setOpenUpdate(false);
          setForceRefetch(true);
        }}
      />
      <MarkAsCompletePopUp
        isOpen={openComplete}
        onClose={() => setOpenComplete(false)}
        onSubmit={async () => {
          await completeJob({id: selectedRequest!.id});
          setOpenComplete(false);
          setForceRefetch(true);
        }}
      />
      <RatingPopup
        isOpen={openRating}
        onClose={() => setOpenRating(false)}
        onSubmit={async (values) => {
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
        onSubmit={async (responder) => {
          await acceptProposal({ requestId: selectedRequest!.id, responderId: responder.id });
          setOpenResponders(false);
          setForceRefetch(true);
        }}
      />
      <SidebarWithHeader portal={Portal.CLIENT}>
        <VStack bg={"white"} rounded={"md"} p={5} spacing={5} w={"full"}>
          <HStack justify={"space-between"} w={"full"}>
            <Heading size={"md"}>Request table</Heading>
            <Button variant={"primary"} onClick={() => {
              setSelectedRequest(undefined)
              setOpenCreate(true)
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
