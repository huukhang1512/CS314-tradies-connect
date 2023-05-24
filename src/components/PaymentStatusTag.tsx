import { Tag, TagLabel } from "@chakra-ui/react";
import { PaymentStatus } from "@prisma/client";

export const PaymentStatusTag = ({ value }: { value: PaymentStatus }) => {
  switch (value) {
    case PaymentStatus.COMPLETED:
      return (
        <Tag size="md" colorScheme="green" borderRadius="full">
          <TagLabel>Completed</TagLabel>
        </Tag>
      );
    case PaymentStatus.PENDING:
      return (
        <Tag size="md" colorScheme="gray" borderRadius="full">
          <TagLabel>Pending</TagLabel>
        </Tag>
      );
    default:
      return (
        <Tag size="md" colorScheme="red" borderRadius="full">
          <TagLabel text-transform={"capitalize"}>
            {value.toLowerCase()}
          </TagLabel>
        </Tag>
      );
  }
};
