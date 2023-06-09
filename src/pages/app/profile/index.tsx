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
import { MembershipType, type Service } from "@prisma/client";
import { TbCurrentLocation } from "react-icons/tb";
import { reverseGeocode } from "@/utils/location/locationService";

const serviceToSelectValue = (service: Service) => ({
  value: service.name,
  label: service.name,
});

const Profile = () => {
  const { data: sessionData, update } = useSession();
  const { data: providedServicesData } =
    api.services.getUserProvidedServices.useQuery();
  const { data: services } = api.services.getServices.useQuery();
  const { data: userData } = api.users.me.useQuery();
  const { data: activeMemberships } =
    api.memberships.getUserActiveMembership.useQuery();
  const { mutateAsync: getServicesByName, isLoading: isGettingServiceByName } =
    api.services.getServicesByName.useMutation();
  const { mutateAsync: editUserDetail } = api.users.updateUser.useMutation();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const getCurrentLocation = () => {
    window.navigator.geolocation.getCurrentPosition((position) => {
      void setLocationDetails(
        position.coords.latitude,
        position.coords.longitude
      );
    });
  };

  const setLocationDetails = async (latitude: number, longitude: number) => {
    const { lat, lon, display_name } = await reverseGeocode(
      latitude,
      longitude
    );
    void formik.setValues({
      ...formik.values,
      lat,
      lng: lon,
      address: display_name,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: sessionData?.user.email || "",
      name: sessionData?.user.name || "",
      address: userData?.address || "",
      lat: userData?.lat || "",
      lng: userData?.lng || "",
      phoneNumber: userData?.phoneNumber || "",
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
        phoneNumber: values.phoneNumber,
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

  if (!services || !sessionData || !providedServicesData || !activeMemberships)
    return <></>;
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
                <HStack>
                  {activeMemberships?.map((activeMembership, i) => (
                    <>
                      <Text
                        color={"text.secondary"}
                        key={`${activeMembership.membershipId}_${activeMembership.userId}`}
                      >
                        {activeMembership.membership.type} plan (Next Billing
                        Date:{" "}
                        {activeMembership.expiredAt &&
                          activeMembership.expiredAt.toLocaleDateString()}
                        )
                      </Text>
                      {i < activeMemberships.length - 1 && (
                        <Divider
                          color={"background.gray"}
                          h={5}
                          orientation="vertical"
                        />
                      )}
                    </>
                  ))}
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
            <GridItem>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  id={"phoneNumber"}
                  name={"phoneNumber"}
                  type={"tel"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  borderWidth={1}
                  isReadOnly={isReadOnly}
                  value={formik.values.phoneNumber}
                />
              </FormControl>
            </GridItem>
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
                    <Tooltip
                      label={"Get my current location"}
                      isDisabled={isReadOnly}
                    >
                      <IconButton
                        isDisabled={isReadOnly}
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
