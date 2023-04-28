import React, { useCallback, useMemo } from "react";
import CustomTable from "../Table";
import { api } from "@/utils/api";
export interface UserManagementProps {}

const UserManagement = (_props: UserManagementProps) => {
  const { mutateAsync } = api.admin.users.getUsers.useMutation();

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
    <>
      <CustomTable getData={getData} columns={columns} />
    </>
  );
};

export default UserManagement;
