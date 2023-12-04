// import React from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
import TestC from "./test";
import { get_resavations } from "@/app/lib/reservatActions";

export default async function Caisse() {
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const resPres = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-store",
  });

  const clients = await resClt.json();
  const prestations = await resPres.json();
  const reservat = await get_resavations({ id: 35 });
  console.log("reservation", JSON.parse(reservat));
  // return;
  return (
    <div className="h-screen  p-6 grid xl:grid-cols-2 lg:grid-cols-1  gap-16">
      <CaisseForm clients={clients} reservation={JSON.parse(reservat)} />
      <Prestations prestations={prestations} />
      {/* <TestC /> */}
    </div>
  );
}
