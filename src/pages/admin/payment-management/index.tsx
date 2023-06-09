import { PaymentStatusTag } from "@/components/PaymentStatusTag";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable from "@/components/Table";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
import { type Payment } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { type Column } from "react-table";

const PaymentManagement = () => {
  const { mutateAsync } = api.payments.getPayments.useMutation();
  const [forceRefetch] = useState(true);

  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      return await mutateAsync({ page, perPage });
    },
    [mutateAsync]
  );
  const columns = useMemo<Column<Payment>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "TYPE",
        accessor: "paymentType",
      },
      {
        Header: "AMOUNT",
        accessor: "amount",
        Cell: ({ value }) => {
          return <>${value}</>;
        },
      },
      {
        Header: "STATUS",
        accessor: "paymentStatus",
        Cell: ({ value }) => <PaymentStatusTag value={value} />,
      },
      {
        Header: "USER ID",
        accessor: "userId",
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

export default PaymentManagement;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
