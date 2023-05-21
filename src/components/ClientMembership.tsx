import { Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import membershipSVG from "@/assets/membership.svg";
import crownIconSVG from "@/assets/crownIcon.svg";

export const ClientMembership = () => {
  return (
    <HStack
      bg={"white"}
      p={6}
      justify={"space-between"}
      maxW={"1073px"}
      h={"590px"}
    >
      <VStack
        align={"center"}
        justify={"space-between"}
        h={"full"}
        w={"full"}
        spacing={10}
      >
        <VStack spacing={10} p={20}>
          <VStack>
            <Heading
              as={"h3"}
              size={"md"}
              textAlign={"center"}
              color={"text.secondary"}
            >
              Client Membership
            </Heading>
            <Image src={crownIconSVG} alt={"Crown Icon"} />
          </VStack>
          <Heading size={"xl"} textAlign={"center"}>
            100 AUD
          </Heading>
          <VStack minW={"60%"}>
            <HStack color={"blue.primary"} w={"full"}>
              <IoCheckmarkCircleOutline size={"18px"} />
              <Text color={"text.secondary"}>
                Fixed membership fee annually
              </Text>
            </HStack>
            <HStack color={"blue.primary"} w={"full"}>
              <IoCheckmarkCircleOutline size={"18px"} />
              <Text color={"text.secondary"}>
                Unlimited assistance callouts
              </Text>
            </HStack>
          </VStack>
        </VStack>
        <Button w={"full"} variant={"primary"}>
          Purchase
        </Button>
      </VStack>
      <Image src={membershipSVG} alt={"Membership picture"} />
    </HStack>
  );
};
