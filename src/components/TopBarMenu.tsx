import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";

export type TopBarMenuProps = {};

import { signOut } from "next-auth/react";
import AvatarMenuButton from "./AvatarMenuButton";

const TopBarMenu = (props: TopBarMenuProps) => {
  return (
    <Menu>
      <AvatarMenuButton />
      <MenuList
        bg={useColorModeValue("white", "gray.900")}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default TopBarMenu;