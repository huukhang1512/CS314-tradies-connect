import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import {
  Avatar,
  Box,
  Button,
  Circle,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import profileCoverPhoto from "@/assets/profileCoverPhoto.jpg";
import { AsyncSelect, type MultiValue } from "chakra-react-select";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useFormik } from "formik";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { type Service } from "@prisma/client";

const serviceToSelectValue = (service: Service) => ({
  value: service.name,
  label: service.name,
});

const Profile = () => {
  const { data: sessionData, update } = useSession();
  const { data: providedServicesData } =
    api.services.getUserProvidedServices.useQuery();
  const { data: services } = api.services.getServices.useQuery();

  const { mutateAsync: getServicesByName, isLoading: isGettingServiceByName } =
    api.services.getServicesByName.useMutation();
  const { mutateAsync: editUserDetail } = api.users.updateUser.useMutation();

  const [isReadOnly, setIsReadOnly] = useState(true);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: sessionData?.user.email || "",
      name: sessionData?.user.name || "",
      providedServices:
        providedServicesData?.providedServices.map((service) =>
          serviceToSelectValue(service)
        ) || [],
    },
    onSubmit: async (values) => {
      if (!sessionData) return;
      const { data: updatedUser } = await editUserDetail({
        id: sessionData?.user.id,
        email: values.email,
        name: values.name,
        providedServices: values.providedServices.map(
          (service) => service.label
        ),
      });
      setIsReadOnly(true);
      await update();
      formik.resetForm({
        values: {
          email: updatedUser.email || "",
          name: updatedUser.name || "",
          providedServices: updatedUser.providedServices.map((service) =>
            serviceToSelectValue(service)
          ),
        },
      });
    },
  });

  const searchServices = async (inputValue: string) => {
    const filteredServices = await getServicesByName(inputValue);
    return filteredServices.map((service) => serviceToSelectValue(service));
  };

  const handleSelectChange = (
    e: MultiValue<{ value: string; label: string }>
  ) => {
    void formik.setFieldValue("providedServices", e);
  };

  const cancelEdit = () => {
    setIsReadOnly(true);
    formik.resetForm();
  };

  if (!services || !sessionData || !providedServicesData) return <></>;
  return (
    <SidebarWithHeader portal={Portal.PROFILE}>
      <VStack bg={"white"} rounded={"md"}>
        <Box
          minH={200}
          h={"20vh"}
          maxH={300}
          w={"full"}
          rounded={"md"}
          backgroundImage={profileCoverPhoto.src}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
        />
        <HStack w={"full"} minH={150} pos={"relative"}>
          <HStack
            w={"full"}
            top={-10}
            position={"absolute"}
            px={5}
            justify={"space-between"}
          >
            <HStack spacing={5}>
              <Circle p={1} bg={"white"} shadow={"2xl"}>
                <Avatar
                  w={150}
                  h={150}
                  display={{ base: "none", md: "flex" }}
                  src={sessionData.user.image || undefined}
                  title={sessionData.user.name || undefined}
                />
              </Circle>
              <VStack align={"flex-start"}>
                <Heading size={"lg"}>{sessionData.user.name}</Heading>
                <HStack spacing={5}>
                  <Text color={"text.secondary"}>Customer</Text>
                  <Divider
                    color={"background.gray"}
                    h={5}
                    orientation="vertical"
                  />
                  <Text color={"text.secondary"}>
                    Premium plan (Start date: 10/03/2023)
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <Button
                variant={"primary"}
                px={7}
                onClick={() =>
                  isReadOnly ? setIsReadOnly(false) : cancelEdit()
                }
              >
                {isReadOnly ? "Edit" : "Cancel"}
              </Button>
            </HStack>
          </HStack>
        </HStack>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <SimpleGrid w={"full"} columns={2} gap={5} p={5}>
            <GridItem>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  id={"email"}
                  name={"email"}
                  type={"email"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                  isReadOnly={isReadOnly}
                  value={formik.values.email}
                />
              </FormControl>
            </GridItem>
            <GridItem>
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
                  isReadOnly={isReadOnly}
                  value={formik.values.name}
                />
              </FormControl>
            </GridItem>
            {/* TODO(khang): Read address from user db*/}
            <GridItem>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  variant={"filled"}
                  bg={"background.gray"}
                  placeholder={"123 Haig Street, George Avenue, NSW 2200"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              {/* TODO(khang): make this field readonly if user isn't register as tradies */}
              <FormControl>
                <FormLabel>Provided Services</FormLabel>
                <AsyncSelect
                  id={"providedServices"}
                  name={"providedServices"}
                  isMulti
                  isReadOnly={isReadOnly}
                  isClearable={!isReadOnly}
                  isLoading={isGettingServiceByName}
                  loadOptions={searchServices}
                  onChange={handleSelectChange}
                  value={formik.values.providedServices}
                  defaultOptions={services.map((service) => ({
                    label: service.name,
                    value: service.name,
                  }))}
                />
              </FormControl>
            </GridItem>
            {!isReadOnly && (
              <GridItem colSpan={2}>
                <HStack justify={"end"}>
                  <IconButton
                    icon={<AiOutlineCheck />}
                    aria-label="Change user detail"
                    color={"green"}
                    type={"submit"}
                  />
                  <IconButton
                    icon={<AiOutlineClose />}
                    aria-label="Cancel"
                    color={"red"}
                    onClick={cancelEdit}
                  />
                </HStack>
              </GridItem>
            )}
          </SimpleGrid>
        </form>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Profile;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
