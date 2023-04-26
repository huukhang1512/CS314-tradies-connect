import { Avatar, Button, MenuButton, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";

export interface AvatarMenuButtonProps {}
const AvatarMenuButton = (_props: AvatarMenuButtonProps) => {
  const { data } = useSession();
  if (!data) return <></>;
  return (
    <MenuButton
      as={Button}
      variant={"ghost"}
      leftIcon={
        <Avatar
          size={"sm"}
          display={{ base: "none", md: "flex" }}
          src={data.user.image || undefined}
          title={data.user.name || undefined}
        />
      }
      rightIcon={<ChevronDownIcon />}
    >
      <Text
        color="text.secondary"
        fontSize={"sm"}
        display={{ base: "none", md: "flex" }}
      >
        {data.user.name || ""}
      </Text>
    </MenuButton>
  );
};

export default AvatarMenuButton;
