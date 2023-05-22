import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable, { type RowAction } from "@/components/Table";
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
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { type Service } from "@prisma/client";
import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import { MdUpdate } from "react-icons/md";
import { type Column } from "react-table";

const ServicePopup = ({
  isOpen,
  title,
  mode = "create",
  service,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  title: string;
  mode?: "update" | "create";
  service?: Service;
  onClose: () => void;
  onSubmit: (values: Service) => Promise<void>;
}) => {
  const formik = useFormik<Service>({
    enableReinitialize: true,
    initialValues: {
      name: service?.name || "",
      rate: service?.rate || 0,
      description: service?.description || "",
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={3}>
        <HStack alignItems={"center"} justify={"space-between"} p={3}>
          <ModalHeader whiteSpace={"nowrap"} p={0}>
            {title}
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
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  id={"name"}
                  name={"name"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                  value={formik.values.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rate</FormLabel>
                <InputGroup>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    id={"rate"}
                    name={"rate"}
                    type={"number"}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.rate}
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
                />
              </FormControl>
              <Button
                variant={"primary"}
                w={"full"}
                textTransform={"capitalize"}
                type={"submit"}
              >
                {mode}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
const ServiceMangement = () => {
  const { mutateAsync: getServices } =
    api.services.paginatedGetServices.useMutation();
  const { mutateAsync: createNewService } =
    api.services.createNewService.useMutation();
  const { mutateAsync: updateNewService } =
    api.services.updateService.useMutation();

  const [isCreatingPopup, setIsCreatingPopup] = useState(false);
  const [forceRefetch, setForceRefetch] = useState(true);
  const [selectedService, setSelectedService] = useState<Service>();
  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      setForceRefetch(false);
      return await getServices({ page, perPage });
    },
    [getServices]
  );
  const columns = useMemo<Column<Service>[]>(
    () => [
      {
        Header: "SERVICE NAME",
        accessor: "name",
      },
      {
        Header: "RATE",
        accessor: "rate",
      },
      {
        Header: "DESCRIPTION",
        accessor: "description",
      },
    ],
    []
  );
  const rowActions: RowAction<Service>[] = [
    {
      actionName: "Update services",
      icon: <MdUpdate />,
      callback: (row) => setSelectedService(row),
    },
  ];
  return (
    <SidebarWithHeader portal={Portal.ADMIN}>
      <ServicePopup
        isOpen={isCreatingPopup}
        onClose={() => setIsCreatingPopup(false)}
        onSubmit={async (service) => {
          await createNewService({
            ...service,
          });
          setIsCreatingPopup(false);
          setForceRefetch(true);
        }}
        title={"Creating new service"}
      />
      <ServicePopup
        isOpen={!!selectedService}
        service={selectedService}
        mode={"update"}
        onClose={() => setSelectedService(undefined)}
        onSubmit={async (service) => {
          await updateNewService({
            ...service,
          });
          setSelectedService(undefined);
          setForceRefetch(true);
        }}
        title={"Updating service"}
      />
      <VStack bg={"white"} rounded={"md"} p={5} spacing={5} w={"full"}>
        <HStack justify={"space-between"} w={"full"}>
          <Heading size={"md"}>Service Management table</Heading>
          <Button variant={"primary"} onClick={() => setIsCreatingPopup(true)}>
            Create new service
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
  );
};

export default ServiceMangement;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
