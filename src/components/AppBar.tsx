import { HStack, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TopBarMenu from "./TopBarMenu";

const AppBar = () => {
  const { data } = useSession();
  return (
    <HStack
      position={"absolute"}
      w={"full"}
      top={0}
      p={5}
      justify={"space-between"}
      align={"center"}
    >
      <Link href="/app">
        <Heading fontSize={"xl"} alignSelf={"flex-start"} color="text.primary">
          Tradies connect
        </Heading>
      </Link>
      {data && (
        <HStack spacing={3}>
          <TopBarMenu />
        </HStack>
      )}
    </HStack>
  );
};
export default AppBar;
