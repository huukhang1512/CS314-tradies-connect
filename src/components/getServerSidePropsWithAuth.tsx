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

  if (
    context.resolvedUrl === "/app/client" &&
    session?.user.role === Role.USER
  ) {
    return { redirect: { destination: "/app/client/requests" } };
  }

  if (
    context.resolvedUrl === "/app/tradie" &&
    session?.user.role === Role.USER
  ) {
    return { redirect: { destination: "/app/tradie/requests" } };
  }

  return {
    props: { session },
  };
};
