import { useSession } from "next-auth/react";

const useAuthCheck = () => {
  const { data: session } = useSession();

  return !!session;
};

export default useAuthCheck;