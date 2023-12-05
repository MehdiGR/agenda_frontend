// import React from "react";

import Container from "./container";
import { get_resavations } from "@/app/lib/reservatActions";

export default async function Caisse({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // console.log(searchParams);
  // return;
  const { res: idRes } = searchParams;
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const resPres = await fetch("http://localhost:3000/api/prestation", {
    cache: "no-store",
  });
  const resAg = await fetch("http://localhost:3000/api/agenda", {
    cache: "no-store",
  });
  const agendas = await resAg.json();

  const clients = await resClt.json();
  const prestations = await resPres.json();
  const reservation = await get_resavations({ id: Number(idRes) });
  // console.log("reservation", JSON.parse(reservation));

  return (
    <div className="h-screen  p-6 grid xl:grid-cols-2 lg:grid-cols-1  gap-16">
      <Container
        clients={clients}
        reservation={JSON.parse(reservation)}
        agendas={agendas}
        prestations={prestations}
      />
    </div>
  );
}
