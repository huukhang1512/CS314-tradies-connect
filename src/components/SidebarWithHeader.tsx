import React, { type ReactNode, useState } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  type BoxProps,
  type FlexProps,
  Heading,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMenu, FiBell } from "react-icons/fi";
import { AiOutlineFileDone } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { type IconType } from "react-icons";
import { BiBadgeCheck } from "react-icons/bi";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import { TbTools } from "react-icons/tb";
import { MdCardMembership } from "react-icons/md";
import TopBarMenu from "./TopBarMenu";
interface LinkItemProps {
  name: string;
  icon: IconType;
  component?: ReactNode;
}

const AdminLinkItems: LinkItemProps[] = [
  { name: "User Management", icon: HiOutlineUserGroup },
  { name: "Request Management", icon: HiOutlineClipboardList },
  { name: "Payment Management", icon: IoWalletOutline },
  { name: "Service Management", icon: TbTools },
  { name: "Membership Management", icon: MdCardMembership },
];

const TradieLinkItems: LinkItemProps[] = [
  { name: "Available Requests", icon: HiOutlineGlobeAlt },
  { name: "My proposal list", icon: HiOutlineClipboardList },
  { name: "Subcriptions", icon: BiBadgeCheck },
  { name: "My payment", icon: IoWalletOutline },
];

const ClientLinkItems: LinkItemProps[] = [
  { name: "My request list", icon: AiOutlineFileDone },
  { name: "Subcriptions", icon: BiBadgeCheck },
  { name: "My payment", icon: IoWalletOutline },
];

export enum Portal {
  ADMIN = "admin",
  TRADIE = "tradie",
  CLIENT = "client",
}

const LinkItemsList: Record<Portal, LinkItemProps[]> = {
  [Portal.ADMIN]: AdminLinkItems,
  [Portal.TRADIE]: TradieLinkItems,
  [Portal.CLIENT]: ClientLinkItems,
};

export type SidebarWithHeaderProps = {
  children?: ReactNode;
  portal: Portal;
};

export default function SidebarWithHeader(props: SidebarWithHeaderProps) {
  const { children, portal } = props;
  const [currPage, setCurrPage] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" w="100vw" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        currPage={currPage}
        portal={portal}
        setCurrPage={setCurrPage}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            currPage={currPage}
            portal={portal}
            setCurrPage={setCurrPage}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} currPage={currPage} portal={portal} />
      <Box ml={{ base: 0, md: 300 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  currPage: number;
  portal: Portal;
  setCurrPage: (page: number) => void;
}

const SidebarContent = ({
  onClose,
  currPage,
  portal,
  setCurrPage,
  ...rest
}: SidebarProps) => {
  const LinkItems = LinkItemsList[portal];
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 300 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" p={5} justifyContent="space-between">
        <Link href="/app">
          <Heading
            fontSize={"xl"}
            alignSelf={"flex-start"}
            color="text.primary"
          >
            Tradies connect
          </Heading>
        </Link>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <VStack px={5}>
        {LinkItems.map((link: LinkItemProps, i: number) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            onClick={() => setCurrPage(i)}
            index={i}
            currPage={currPage}
          >
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  index: number;
  currPage: number;
}
const NavItem = ({
  icon,
  children,
  index,
  currPage,
  ...rest
}: NavItemProps) => {
  const style =
    index === currPage
      ? {
          bg: "blue.01",
          color: "blue.primary",
        }
      : {};

  return (
    <Flex
      as={Link}
      href="#"
      sx={style}
      align="center"
      w={"full"}
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "blue.01",
        color: "blue.primary",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "blue.primary",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  currPage: number;
  portal: Portal;
}
const MobileNav = ({ onOpen, currPage, portal, ...rest }: MobileProps) => {
  const LinkItems = LinkItemsList[portal];

  return (
    <Flex
      ml={{ base: 0, md: 300 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        w={{ base: "100%" }}
        display={{ base: "flex" }}
        fontSize="2xl"
        ml={{ base: "4", md: "6" }}
        fontWeight="bold"
      >
        {LinkItems[currPage]?.name}
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <TopBarMenu />
        </Flex>
      </HStack>
    </Flex>
  );
};
