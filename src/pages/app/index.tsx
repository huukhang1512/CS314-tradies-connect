import AppBar from "@/components/AppBar";
import { authOptions } from "@/server/auth";
import { VStack } from "@chakra-ui/react";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

const App = () => {
  return (
    <VStack>
      <AppBar />
    </VStack>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/" } };
  }
  return {
    props: { session },
  };
};

export default App;
