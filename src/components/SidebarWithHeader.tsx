import React, { type ReactNode } from "react";
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
  useDisclosure,
  type BoxProps,
  type FlexProps,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMenu, FiBell } from "react-icons/fi";
import { AiOutlineFileDone } from "react-icons/ai";
import { IoWalletOutline, IoPeopleOutline } from "react-icons/io5";
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
import { useRouter } from "next/router";

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
  component?: ReactNode;
}

const AdminLinkItems: LinkItemProps[] = [
  {
    name: "User Management",
    icon: HiOutlineUserGroup,
    link: "/admin/user-management",
  },
  {
    name: "Request Management",
    icon: HiOutlineClipboardList,
    link: "/admin/request-management",
  },
  {
    name: "Payment Management",
    icon: IoWalletOutline,
    link: "/admin/payment-management",
  },
  {
    name: "Service Management",
    icon: TbTools,
    link: "/admin/service-management",
  },
  {
    name: "Membership Management",
    icon: MdCardMembership,
    link: "/admin/membership-management",
  },
];

const TradieLinkItems: LinkItemProps[] = [
  { name: "Available Requests", icon: HiOutlineGlobeAlt, link: "" },
  { name: "My proposal list", icon: HiOutlineClipboardList, link: "" },
  { name: "Subcriptions", icon: BiBadgeCheck, link: "" },
  { name: "My payment", icon: IoWalletOutline, link: "" },
];

const ClientLinkItems: LinkItemProps[] = [
  { name: "My request list", icon: AiOutlineFileDone, link: "" },
  { name: "Subcriptions", icon: BiBadgeCheck, link: "" },
  { name: "My payment", icon: IoWalletOutline, link: "" },
];

const ProfileLinkItems: LinkItemProps[] = [
  { name: "Account Details", icon: IoPeopleOutline, link: "" },
  { name: "Subcriptions", icon: BiBadgeCheck, link: "" },
  { name: "My payment", icon: IoWalletOutline, link: "" },
];

export enum Portal {
  ADMIN = "admin",
  PROFILE = "profile",
  TRADIE = "tradie",
  CLIENT = "client",
}

const LinkItemsList: Record<Portal, LinkItemProps[]> = {
  [Portal.ADMIN]: AdminLinkItems,
  [Portal.PROFILE]: ProfileLinkItems,
  [Portal.TRADIE]: TradieLinkItems,
  [Portal.CLIENT]: ClientLinkItems,
};

export type SidebarWithHeaderProps = {
  children?: ReactNode;
  portal: Portal;
};

export default function SidebarWithHeader(props: SidebarWithHeaderProps) {
  const { children, portal } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <HStack
      minH="full"
      w="full"
      spacing={0}
      bg={useColorModeValue("gray.100", "gray.900")}
    >
      <SidebarContent
        onClose={onClose}
        curPage={router.pathname}
        display={{ base: "none", md: "block" }}
        portal={portal}
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
            portal={portal}
            curPage={router.pathname}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <VStack pos={"relative"} w={"full"} h={"full"}>
        <MobileNav onOpen={onOpen} portal={portal} curPage={router.pathname} />
        <Box p="4" w={"full"} h={"full"}>
          {children}
        </Box>
      </VStack>
    </HStack>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  curPage: string;
  portal: Portal;
}

const SidebarContent = ({
  onClose,
  portal,
  curPage,
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
        {LinkItems.map((link: LinkItemProps) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            link={link.link}
            curPage={curPage}
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
  curPage: string;
  link: string;
}
const NavItem = ({ icon, children, link, curPage, ...rest }: NavItemProps) => {
  return (
    <Flex
      as={Link}
      href={link}
      bg={link === curPage ? "blue.01" : ""}
      color={link === curPage ? "blue.primary" : ""}
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
  curPage: string;
  portal: Portal;
}
const MobileNav = ({ onOpen, curPage, portal, ...rest }: MobileProps) => {
  const LinkItems = LinkItemsList[portal];

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      top={0}
      w={"full"}
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
        {LinkItems.find((item) => item.link === curPage)?.name}
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
