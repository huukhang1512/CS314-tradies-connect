import { type GetServerSidePropsContext } from "next";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  return (
    <>
      <SidebarWithHeader portal={Portal.ADMIN}>
        <UserManagement />
      </SidebarWithHeader>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session?.user.role !== Role.ADMIN) {
    return { redirect: { destination: "/403" } };
  }
  // If the user is not logged in, redirect.
  if (!session) {
    return { redirect: { destination: "/" } };
  }
  return {
    props: { session },
  };
};

export default Admin;
