import React, { useCallback, useMemo } from "react";
import CustomTable from "../Table";
import { api } from "@/utils/api";
import { Card } from "@chakra-ui/react";
export interface UserManagementProps {}

const UserManagement = (_props: UserManagementProps) => {
  const { mutateAsync } = api.users.getUsers.useMutation();

  const getData = useCallback(
    async (page = 1, perPage = 10) => {
      return await mutateAsync({ page, perPage });
    },
    [mutateAsync]
  );
  const columns = useMemo(
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
        accessor: "phone",
      },
      {
        Header: "ADDRESS",
        accessor: "address",
      },
      {
        Header: "JOINED DATE",
        accessor: "created",
      },
    ],
    []
  );

  return (
    <Card p={5}>
      <CustomTable getData={getData} columns={columns} />
    </Card>
  );
};

export default UserManagement;
