// import React from "react";

import Container from "./container";
import { get_tickets, get_ticket_lines } from "@/app/lib/ticket/ticketActions";

export default async function Caisse({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // console.log("searchParams", searchParams);
  // return;
  const { res: idRes } = searchParams;
  const resClt = await fetch("http://localhost:3000/api/client", {
    cache: "no-store",
  });
  const resCollab = await fetch("http://localhost:3000/api/collaborateur", {
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
  const collaborateurs = await resCollab.json();
  const prestations = await resPres.json();
  // const tickets = await get_tickets({ Num_ticket: Number(idRes) });
  const ticket = await get_ticket_lines({ id: Number(idRes) });
  // console.log("ticket", JSON.parse(ticket));

  return (
    <div className="h-screen  p-6 grid xl:grid-cols-2 lg:grid-cols-1  gap-16">
      <Container
        clients={clients}
        collaborateurs={collaborateurs}
        ticket={JSON.parse(ticket as string)}
        agendas={agendas}
        prestations={prestations}
      />
    </div>
  );
}
