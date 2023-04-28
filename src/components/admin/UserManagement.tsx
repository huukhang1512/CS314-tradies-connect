import React, { useMemo } from "react"
import CustomTable from "../Table"
import { api } from "@/utils/api";
export interface UserManagementProps {

}

const UserManagement = (_props: UserManagementProps) => {
  const {refetch} = api.users.getUsers.useQuery({});
  const getData = async (page = 1, perPage = 10) => {
    const {data} = await refetch({page, perPage});
    return data;
  }
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

  return (<>
    <CustomTable getData={getData} columns={columns}/>
  </>)
}

export default UserManagement;