import styles from "./index.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

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
