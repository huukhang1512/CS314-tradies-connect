import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

import { ChakraProvider, VStack } from "@chakra-ui/react";
import customTheme from "@/theme";
import "@fontsource/rubik";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Tradies Connect</title>
        <meta name="description" content="CS314 assignment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ChakraProvider theme={customTheme}>
          <VStack h={"100vh"} position={"relative"}>
            <VStack
              as="main"
              w={"full"}
              h={"full"}
              m={"0!"}
              bg="background.gray"
            >
              <Component {...pageProps} />
            </VStack>
          </VStack>
        </ChakraProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
