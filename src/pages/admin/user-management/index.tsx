import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable from "@/components/Table";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
import { type User } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { type Column } from "react-table";

const UserManagement = () => {
  const { mutateAsync } = api.users.getUsers.useMutation();
  const [forceRefetch] = useState(true);

  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      return await mutateAsync({ page, perPage });
    },
    [mutateAsync]
  );
  const columns = useMemo<Column<Partial<User>>[]>(
    () => [
      {
        Header: "FULL NAME",
        accessor: "name",
      },
      {
        Header: "EMAIL",
        accessor: "email",
      },
      {
        Header: "PHONE NUMBER",
        accessor: "phoneNumber",
      },
      {
        Header: "ADDRESS",
        accessor: "address",
      },
      {
        Header: "JOINED DATE",
        accessor: "createdAt",
      },
    ],
    []
  );

  return (
    <SidebarWithHeader portal={Portal.ADMIN}>
      <Card p={5}>
        <CustomTable
          refetchState={forceRefetch}
          getData={getData}
          columns={columns}
        />
      </Card>
    </SidebarWithHeader>
  );
};

export default UserManagement;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
