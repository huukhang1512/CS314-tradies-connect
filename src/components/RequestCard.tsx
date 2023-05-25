/* eslint-disable react/display-name */
import {
  Box,
  Button,
  Card,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { MdRoofing } from "react-icons/md";
import {
  TbChristmasTree,
  TbChristmasTreeOff,
  TbCooker,
  TbFence,
} from "react-icons/tb";
import { RxScissors } from "react-icons/rx";
import { CiLocationOn, CiCalendar } from "react-icons/ci"
import { type RequestWithClient } from "@/server/api/routers/request";
type RequestCardProps = {
  request: RequestWithClient;
  onClick: () => void;
};

export const ServiceIcon = (props: { serviceName: string }) => {
  const { serviceName } = props;

  const [Icon, color] = useMemo(() => {
    let Icon: () => React.ReactElement;
    let color: string;
    const size = 50;
    switch (serviceName) {
      case "Fence Installation":
        Icon = () => <TbFence color="white" size={size} />;
        color = "#04CC88";
        break;
      case "Oven Repair":
        Icon = () => <TbCooker color="white" size={size} />;
        color = "#FF8C03";
        break;
      case "Roof Cleaning":
        Icon = () => <MdRoofing color="white" size={size} />;
        color = "#8A5AFF";
        break;
      case "Tree Planting":
        Icon = () => <TbChristmasTree color="white" size={size} />;
        color = "#68DBF2";
        break;
      case "Tree Pruning":
        Icon = () => <RxScissors color="white" size={size} />;
        color = "#FFDB5E";
        break;
      case "Tree Removal":
        Icon = () => <TbChristmasTreeOff color="white" size={size} />;
        color = "#F16063";
        break;
      default:
        Icon = () => <></>;
        color = "#D8DAE2";
    }
    return [Icon, color];
  }, [serviceName]);

  return (
    <Box
      bg={color}
      h={"80px"}
      w={"80px"}
      borderRadius={10}
      padding={"15px"}
      alignContent={"center"}
    >
      {Icon()}
    </Box>
  );
};

export const RequestCard = (props: RequestCardProps) => {
  const { request, onClick } = props;

  return (
    <Card p={5} w={{sm: "100%",lg:"49%"}} my={3}>
      <VStack spacing={3}>
        <HStack w={"full"} spacing={4}>
          <ServiceIcon serviceName={request.serviceName} />
          <VStack alignItems={"flex-start"} spacing={0}>
            <Text as="b" fontSize={"lg"}>
              {request.serviceName}
            </Text>
            <HStack>
              <CiCalendar/>
              <Text fontSize={"xs"} color={"gray"}>
                {request.createdAt.toLocaleDateString()}
              </Text>
            </HStack>
            <HStack>
              <CiLocationOn/>
              <Text fontSize={"xs"} color={"gray"}>
                {request.client.address}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <Text alignSelf={"flex-start"}>{request.description}</Text>
        <Button
          alignSelf={"flex-end"}
          variant={"primary"}
          type={"submit"}
          onClick={onClick}
        >
          View details
        </Button>
      </VStack>
    </Card>
  );
};
