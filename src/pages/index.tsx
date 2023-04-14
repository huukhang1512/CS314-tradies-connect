import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <VStack as="main" bg={"background.gray"} minH={"100vh"} justify={"center"}>
      <Heading as={"h1"} textColor={"text.primary"}>
        Tradies{" "}
        <Heading as="span" textColor={"text.third"}>
          App
        </Heading>
      </Heading>
      <Text>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</Text>
      <AuthShowcase />
    </VStack>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <VStack bg={"measurement.green"} rounded={"xl"} p={10}>
      <Text>
        {sessionData && (
          <Text as={"span"} fontSize={"lg"} fontWeight={"semibold "}>
            Logged in as {sessionData.user?.name}
          </Text>
        )}
        {secretMessage && <Text as={"span"}> - {secretMessage}</Text>}
      </Text>
      <Button
        variant={"primary"}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </VStack>
  );
};
