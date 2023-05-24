import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";

export const PaymentPopup = ({
  total,
  isOpen,
  onClose,
  onSubmit,
}: {
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: unknown) => Promise<void>;
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const formatCardNumberVal = (value: string) => {
    const v = value
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "")
      .slice(0, 16);
    const parts: string[] = [];

    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4));
    }

    return parts.length > 1 ? parts.join(" ") : value;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={3}>
        <HStack alignItems={"center"} justify={"space-between"} p={3}>
          <ModalHeader whiteSpace={"nowrap"} p={0}>
            Payment Details
          </ModalHeader>
          <IconButton
            icon={<CloseIcon />}
            onClick={() => onClose()}
            size={"xs"}
            borderColor={"gray"}
            borderWidth={2}
            p={0}
            aria-label={"Close modal"}
            isRound
            variant={"ghost"}
          />
        </HStack>
        <ModalBody p={3}>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Credit card number</FormLabel>
                <Input
                  type={"tel"}
                  id={"cardNumber"}
                  name={"cardNumber"}
                  onChange={formik.handleChange}
                  variant={"filled"}
                  bg={"background.gray"}
                  borderColor={"text.disable"}
                  maxLength={19}
                  borderWidth={1}
                  value={formatCardNumberVal(formik.values.cardNumber)}
                />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>Expiry date</FormLabel>
                  <Input
                    id={"expiryDate"}
                    name={"expiryDate"}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    maxLength={7}
                    type={"month"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.expiryDate}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    type={"tel"}
                    id={"cvv"}
                    maxLength={4}
                    name={"cvv"}
                    onChange={formik.handleChange}
                    variant={"filled"}
                    bg={"background.gray"}
                    borderColor={"text.disable"}
                    borderWidth={1}
                    value={formik.values.cvv}
                  />
                </FormControl>
              </HStack>
              <Divider />
              <HStack justify={"space-between"} w={"full"}>
                <Text color={"text.secondary"}>Total</Text>
                <Heading size={"sm"}>AUD {total}</Heading>
              </HStack>
              <Button
                variant={"primary"}
                w={"full"}
                textTransform={"capitalize"}
                type={"submit"}
                isDisabled={
                  formik.values.cardNumber.length === 0 ||
                  formik.values.cvv.length === 0 ||
                  formik.values.expiryDate.length === 0
                }
                isLoading={formik.isSubmitting}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
