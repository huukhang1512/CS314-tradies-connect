import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { Role } from "@prisma/client";
import { authOptions } from "@/server/auth";

const App = () => {
  return <>APP</>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session?.user.role === Role.ADMIN) {
    return { redirect: { destination: "/admin" } };
  }
  return {
    props: {},
  };
};

export default App;
