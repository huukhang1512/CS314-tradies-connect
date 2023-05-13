import { authOptions } from "@/server/auth";
import { Role } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export const getServerSidePropsWithAuth = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/" } };
  }

  if (
    (!context.resolvedUrl.startsWith("/admin") || 
    context.resolvedUrl === "/admin") &&
    session?.user.role === Role.ADMIN
  ) {
    return { redirect: { destination: "/admin/user-management" } };
  }

  if (
    context.resolvedUrl.startsWith("/admin") &&
    session?.user.role === Role.USER
  ) {
    return { redirect: { destination: "/403" } };
  }

  return {
    props: { session },
  };
};
