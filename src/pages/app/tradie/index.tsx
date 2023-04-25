import { type NextPage } from "next";
import React from "react";
import { api } from "@/utils/api";

const TradieHome: NextPage = () => {
  const serviceMutation = api.tradie.service.chooseServices.useMutation()
  const setServices = () => {
    serviceMutation.mutate(["Tree Pruning"])
    console.log(serviceMutation.data)
  }

  return (
    <>
      <h1>Tradie Home</h1>
      <button onClick={setServices}>Set Services</button>
    </>
  );
};

export default TradieHome;