// import React from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
export default async function Caisse() {
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const clients = await resClt.json();
  return (
    <div className="h-full  p-6 grid grid-cols-2  gap-10">
      <CaisseForm clients={clients} />
      <Prestations />
    </div>
  );
}
