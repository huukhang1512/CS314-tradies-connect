import AppBar from "@/components/AppBar";
import { VStack } from "@chakra-ui/react";
import { type NextPage } from "next";

export const App: NextPage = () => {
  return (
    <VStack>
      <AppBar />
    </VStack>
  );
};
export default App;
