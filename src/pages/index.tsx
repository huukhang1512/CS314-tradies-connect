import { type InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import {
  Button,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  GridItem,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

const Home = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: sessionData } = useSession();

  return (
    <SimpleGrid bg={"background.gray"} h={"full"} w={"full"} columns={7}>
      <GridItem
        colSpan={3}
        backgroundImage={
          "url('https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg')"
        }
        backgroundSize={"cover"}
        position={"relative"}
      >
        <Box p={5} position={"absolute"}>
          <Heading
            fontSize={"xl"}
            alignSelf={"flex-start"}
            color="background.gray"
          >
            Tradies connect
          </Heading>
        </Box>
      </GridItem>
      <GridItem colSpan={4}>
        <VStack h={"full"} justify={"center"} align={"center"}>
          <VStack align={"flex-start"} spacing={10} w={"70%"}>
            <Heading>👋</Heading>
            <VStack align={"flex-start"} spacing={2}>
              <Heading>Welcome back!</Heading>
              <Text>Let&apos;s build something great</Text>
            </VStack>
            {sessionData ? (
              <Button as={Link} variant={"primary"} href="/app" w={"full"}>
                Open Tradies Connect
              </Button>
            ) : (
              Object.values(providers).map((provider) => (
                <Button
                  key={provider.id}
                  variant={"primary"}
                  w={"full"}
                  onClick={() =>
                    void signIn(provider.id, {
                      callbackUrl: `${window.location.origin}/app`,
                    })
                  }
                >
                  Continue with {provider.name}
                </Button>
              ))
            )}
          </VStack>
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers: providers ?? [] },
  };
};

export default Home;
