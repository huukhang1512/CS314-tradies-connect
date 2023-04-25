import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";

const useAdminCheck = () => {
  const { data: session } = useSession();

  return session?.user?.role === Role.ADMIN;
};

export default useAdminCheck;
