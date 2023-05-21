import { Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { type Membership } from "@prisma/client";
import membershipSVG from "@/assets/membership.svg";
import crownIconSVG from "@/assets/crownIcon.svg";
import Image from "next/image";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export const BaseMembershipCard = ({
  membership,
  hasPurchased,
  onPurchase,
  features,
}: {
  membership: Membership;
  hasPurchased: boolean;
  onPurchase: (membership: Membership) => void;
  features?: string[];
}) => {
  return (
    <HStack
      key={membership.id}
      bg={"white"}
      p={6}
      rounded={"md"}
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
              {membership.type} MEMBERSHIP
            </Heading>
            <Image src={crownIconSVG} alt={"Crown Icon"} />
          </VStack>
          <Heading size={"xl"} textAlign={"center"}>
            {membership.price} AUD
          </Heading>
          <VStack minW={"60%"}>
            {features?.map((feature, i) => (
              <HStack color={"blue.primary"} w={"full"} key={i}>
                <IoCheckmarkCircleOutline size={"18px"} />
                <Text color={"text.secondary"}>{feature}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
        <Button
          w={"full"}
          variant={"primary"}
          isDisabled={hasPurchased}
          onClick={() => onPurchase(membership)}
        >
          {hasPurchased ? "Purchased" : "Purchase"}
        </Button>
      </VStack>
      <Image src={membershipSVG} alt={"Membership picture"} />
    </HStack>
  );
};
