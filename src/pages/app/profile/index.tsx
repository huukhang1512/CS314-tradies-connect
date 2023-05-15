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
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  Tooltip,
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
import { TbCurrentLocation } from "react-icons/tb";

const serviceToSelectValue = (service: Service) => ({
  value: service.name,
  label: service.name,
});

const Profile = () => {
  const { data: sessionData, update } = useSession();
  const { data: providedServicesData } =
    api.services.getUserProvidedServices.useQuery();
  const { data: services } = api.services.getServices.useQuery();
  const { data: userData } = api.users.getUser.useQuery({ id: sessionData?.user.id || '' });

  const { mutateAsync: getServicesByName, isLoading: isGettingServiceByName } =
    api.services.getServicesByName.useMutation();
  const { mutateAsync: editUserDetail } = api.users.updateUser.useMutation();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const getCurrentLocation = () => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      void reverseGeocode(position.coords.latitude, position.coords.longitude);
    });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const data = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&extratags=1`
    );
    const address = await data.json();
    void formik.setValues({
      ...formik.values,
      lat,
      lng,
      address: address.display_name,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: sessionData?.user.email || "",
      name: sessionData?.user.name || "",
      address: userData?.address || "",
      lat: userData?.lat || 0,
      lng: userData?.lng || 0,
      providedServices:
        providedServicesData?.providedServices.map((service) =>
          serviceToSelectValue(service)
        ) || [],
    },
    onSubmit: async (values) => {
      if (!sessionData) return;
      await editUserDetail({
        id: sessionData?.user.id,
        email: values.email,
        name: values.name,
        lat: values.lat,
        lng: values.lng,
        address: values.address,
        providedServices: values.providedServices.map(
          (service) => service.label
        ),
      });
      await update();
      setIsReadOnly(true);
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
                onClick={() => setIsReadOnly(!isReadOnly)}
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
                <InputGroup>
                  <Input
                    variant={"filled"}
                    bg={"background.gray"}
                    readOnly
                    value={formik.values.address}
                    placeholder={"123 Haig Street, George Avenue, NSW 2200"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                  />
                  <InputRightElement>
                    <Tooltip label={"Get my current location"}>
                      <IconButton
                        variant={"ghost"}
                        aria-label="current location icon"
                        onClick={getCurrentLocation}
                        icon={<TbCurrentLocation />}
                      />
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
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
                    onClick={() => setIsReadOnly(true)}
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