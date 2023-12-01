// import React from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
import TestC from "./test";
export default async function Caisse() {
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const resPres = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-store",
  });
  const clients = await resClt.json();
  const prestations = await resPres.json();
  return (
    <div className="h-screen  p-6 grid xl:grid-cols-2 lg:grid-cols-1  gap-16">
      <CaisseForm clients={clients} />
      <Prestations prestations={prestations} />
      {/* <TestC /> */}
    </div>
  );
}
