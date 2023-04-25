import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";

const AppBar = () => {
  const { data } = useSession();
  return (
    <HStack
      position={"absolute"}
      w={"full"}
      p={5}
      justify={"space-between"}
      align={"center"}
    >
      <Heading fontSize={"xl"} alignSelf={"flex-start"} color="text.primary ">
        Tradies connect
      </Heading>
      {data && (
        <HStack spacing={3}>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={
                <Avatar
                  size={"sm"}
                  src={data.user.image || undefined}
                  title={data.user.name || undefined}
                />
              }
              rightIcon={<ChevronDownIcon />}
            >
              <Text color="text.secondary" fontSize={"sm"}>
                {data.user.name}
              </Text>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => void signOut()}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      )}
    </HStack>
  );
};
export default AppBar;
