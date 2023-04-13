import styles from "./index.module.css";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo } from "react";
import useAdminCheck from "@/hooks/useAdminCheck";
import { api } from "@/utils/api";
import { useRouter } from 'next/router'
import useAuthCheck from "@/hooks/useAuthCheck";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <AuthShowcase />
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const isAdmin = useAdminCheck();
  const isAuth = useAuthCheck();

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    } else if (isAuth) {
      router.push("/u");
    }
  }, [isAdmin, isAuth, router]);

  return (
    <div className={styles.authContainer}>
      <p className={styles.showcaseText}>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className={styles.loginButton}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
