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
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import profileCoverPhoto from "@/assets/profileCoverPhoto.jpg";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data } = useSession();
  if (!data) return <></>;
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
                  src={data.user.image || undefined}
                  title={data.user.name || undefined}
                />
              </Circle>
              <VStack align={"flex-start"}>
                <Heading size={"lg"}>{data.user.name}</Heading>
                <HStack spacing={5}>
                  <Text color={"text.secondary"}>Customer</Text>
                  <Divider bg={"background.gray"} orientation="vertical" />
                  <Text color={"text.secondary"}>
                    Premium plan (Start date: 10/03/2023)
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack>
              <Button variant={"primary"} px={7}>
                Edit
              </Button>
            </HStack>
          </HStack>
        </HStack>
        <SimpleGrid w={"full"} columns={2} gap={5} p={5}>
          <GridItem>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                variant={"filled"}
                bg={"background.gray"}
                borderColor={"text.disable"}
                borderWidth={1}
                value={data.user.email || ""}
                isReadOnly
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                variant={"filled"}
                bg={"background.gray"}
                borderColor={"text.disable"}
                borderWidth={1}
                value={data.user.name || ""}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            {/* TODO(khang): make this field readonly if user isn't register as tradies */}
            <FormControl>
              <FormLabel>Provided Services</FormLabel>
              <Input
                variant={"filled"}
                bg={"background.gray"}
                borderColor={"text.disable"}
                borderWidth={1}
                value={data.user.email || ""}
                isReadOnly
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </SidebarWithHeader>
  );
};

export default Profile;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
