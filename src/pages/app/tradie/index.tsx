import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import { api } from "@/utils/api";

const Tradie = () => {
  const serviceMutation = api.services.chooseServices.useMutation();
  const setServices = () => {
    serviceMutation.mutate({services: ["Tree Pruning"]});
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
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
