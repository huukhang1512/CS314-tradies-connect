import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable from "@/components/Table";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
import { type Membership } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { type Column } from "react-table";

const MembershipManagement = () => {
  const { mutateAsync } = api.memberships.getMemberships.useMutation();
  const [forceRefetch] = useState(true);

  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      return await mutateAsync({ page, perPage });
    },
    [mutateAsync]
  );
  const columns = useMemo<Column<Membership>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "TYPE",
        accessor: "type",
      },
      {
        Header: "AMOUNT",
        accessor: "price",
        Cell: ({ value }) => {
          return <>${value}</>;
        },
      },
      {
        Header: "DATE",
        accessor: "createdAt",
        Cell: ({ value }) => <>{value.toLocaleDateString()}</>,
      },
    ],
    []
  );

  return (
    <SidebarWithHeader portal={Portal.ADMIN}>
      <Card p={5} w={"full"}>
        <CustomTable
          refetchState={forceRefetch}
          getData={getData}
          columns={columns}
        />
      </Card>
    </SidebarWithHeader>
  );
};

export default MembershipManagement;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
