import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { getServerSideProps as redirect } from "@/pages/app";
import { api } from "@/utils/api";

export const getServerSideProps = redirect;

const Tradie = () => {
  const serviceMutation = api.service.chooseServices.useMutation();
  const setServices = () => {
    serviceMutation.mutate(["Tree Pruning"]);
    console.log(serviceMutation.data);
  };
  return (
    <SidebarWithHeader portal={Portal.TRADIE}>
      <h1>Tradie Home</h1>
      <button onClick={setServices}>Set Services</button>
    </SidebarWithHeader>
  );
};
export default Tradie;
