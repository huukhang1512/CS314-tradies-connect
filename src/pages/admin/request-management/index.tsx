import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable from "@/components/Table";
import { renderStatus } from "@/pages/app/client/requests";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
import { type Request } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { type Column } from "react-table";

const RequestManagement = () => {
  const { mutateAsync } = api.requests.getRequests.useMutation();
  const [forceRefetch] = useState(true);

  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      return await mutateAsync({ page, perPage });
    },
    [mutateAsync]
  );
  const columns = useMemo<Column<Request>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "SERVICE",
        accessor: "serviceName",
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: renderStatus,
      },
      {
        Header: "ISSUE",
        accessor: "description",
      },
      {
        Header: "UNIT",
        accessor: "unit",
      },
      {
        Header: "PRICE",
        accessor: "price",
      },
      {
        Header: "CREATED DATE",
        accessor: "createdAt",
        Cell: ({ cell }) => <>{cell.value.toLocaleString("en-AU")}</>,
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

export default RequestManagement;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
