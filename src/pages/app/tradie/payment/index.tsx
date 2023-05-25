import { PaymentStatusTag } from "@/components/PaymentStatusTag";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import { Portal } from "@/components/SidebarWithHeader";
import CustomTable from "@/components/Table";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
import { type Payment } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { type Column } from "react-table";

const TradiePayment = () => {
  const { mutateAsync } = api.payments.getTradieJobPayoutPayment.useMutation();
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
        Header: "PAYMENT TYPE",
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
        Header: "DATE",
        accessor: "createdAt",
        Cell: ({ value }) => <>{value.toLocaleDateString()}</>,
      },
    ],
    []
  );

  return (
    <SidebarWithHeader portal={Portal.TRADIE}>
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

export default TradiePayment;
export { getServerSidePropsWithAuth as getServerSideProps } from "@/components/getServerSidePropsWithAuth";
