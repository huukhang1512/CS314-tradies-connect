import styles from "./index.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import useAdminCheck from "@/hooks/useAdminCheck";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const Home: NextPage = () => {

const Home = () => {
  const { data } = useSession();
  return (
    <button
      className={styles.loginButton}
      onClick={
        data
          ? () => void signOut()
          : () =>
              void signIn("google", {
                callbackUrl: `${window.location.href}/app`,
              })
      }
    >
      {data ? "Sign out" : "Sign in"}
    </button>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const isAdmin = useAdminCheck();
  const router = useRouter();

  if (isAdmin) {
    void router.replace("/admin");
  }


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
