import { type NextPage } from "next";
import { signOut } from "next-auth/react";
import Link from "next/link";
import useAdminCheck from "@/hooks/useAdminCheck";
import useAuthCheck from "@/hooks/useAuthCheck";
import Page403 from "../403";
import { useRouter } from "next/router";
import { useEffect } from "react";

const UserHome: NextPage = () => {
  const isAdmin = useAdminCheck();
  const isAuth = useAuthCheck();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/");
    }
  }, [isAuth]);

  if (isAdmin) return <Page403 />;

  return (
    <>
      <p>What do you want to do today ?</p>
      <Link href="/u/client">Request Services</Link>
      <br />
      <Link href="/u/tradie">Provide Services</Link>
      <br />
      <button onClick={() => void signOut()}>Sign out</button>
    </>
  );
};

export default UserHome;
