import AppBar from "@/components/AppBar";
import { authOptions } from "@/server/auth";
import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

import customerSiteSVG from "@/assets/customerSite.svg";
import tradieSiteSVG from "@/assets/tradieSite.svg";
import Image from "next/image";
import Link from "next/link";

const App = () => {
  return (
    <VStack
      align={"center"}
      minH={"70%"}
      w={"full"}
      justify={"center"}
      position={"relative"}
      spacing={20}
    >
      <AppBar />
      <VStack>
        <Heading as={"h1"} fontSize={"2xl"}>
          Choose site
        </Heading>
        <Text color={"text.secondary"}>Choose to be a client, or a tradie</Text>
      </VStack>
      <Stack
        px={5}
        spacing={20}
        direction={{
          md: "row",
          base: "column",
        }}
      >
        <VStack
          as={Link}
          href={"/app/client"}
          p={5}
          rounded={"lg"}
          bg={"white"}
          spacing={5}
        >
          <Image src={customerSiteSVG} alt={"Client picture"} />
          <Heading as={"h2"} fontSize={"xl"}>
            Client Site
          </Heading>
        </VStack>
        <VStack
          as={Link}
          href={"/app/tradie"}
          p={5}
          rounded={"lg"}
          bg={"white"}
          spacing={5}
        >
          <Image src={tradieSiteSVG} alt={"Tradie picture"} />
          <Heading as={"h2"} fontSize={"xl"}>
            Tradie Site
          </Heading>
        </VStack>
      </Stack>
    </VStack>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session?.user.role === Role.ADMIN) {
    return { redirect: { destination: "/admin" } };
  }
  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/" } };
  }
  return {
    props: { session },
  };
};

export default App;
