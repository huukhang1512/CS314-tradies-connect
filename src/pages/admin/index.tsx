import { type NextPage } from "next";
import { signOut } from "next-auth/react";
import useAdminCheck from "@/hooks/useAdminCheck";
import Page403 from "../403";
import { api } from "@/utils/api";

const AdminHome: NextPage = () => {
  const isAdmin = useAdminCheck();
  const admin = api.example.admin.useQuery();

  if (!isAdmin) return <Page403 />;
  return (
    <>
      <h1>You logged in as an admin!</h1>
      <p>Secret message: {admin.data}</p>
      <button onClick={() => void signOut()}>Sign out</button>
    </>
  );
};

export default AdminHome;
