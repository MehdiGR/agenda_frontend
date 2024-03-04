// import React from "react";

import Container from "../container";
import {
  get_ticket_lines,
  get_ticket_paiements,
} from "@/app/lib/ticket/ticketActions";
import { notFound } from "next/navigation";
import { fetchClients } from "@/app/lib/client/clientActions";
import { fetchCollaborateurs } from "@/app/lib/collaborateur/collaborateurActions";
import { fetchAgenda } from "@/app/lib/agenda/agendaActions";
import { fetchPrestations } from "@/app/lib/prestation/prestationActions";
export default async function Caisse({
  params,
}: {
  params: { slugs: string[] };
}) {
  // const { res: ticketId } = searchParams;

  let ticketId = 0;
  if (params && params.slugs) {
    const valid_param = params.slugs[0] == "ticket";
    // check also if there is a ticket id and is a number
    if (
      params.slugs[0] === "ticket" &&
      params.slugs[1] &&
      !isNaN(Number(params.slugs[1]))
    ) {
      ticketId = parseInt(params.slugs[1]);
    } else {
      notFound();
    }

    // if (!valid_param && params.slugs.length > 0) {
    //   notFound();
    // }

    ticketId =
      params.slugs[0] === "ticket" && params.slugs[1]
        ? parseInt(params.slugs[1])
        : 0;
  }
  const clients = await fetchClients();

  const collaborateurs = await fetchCollaborateurs();

  const prestations = await fetchPrestations();

  const agendas = await fetchAgenda();

  // const ticketLines = await get_ticketLines({ Num_ticket: Number(ticketId) });
  let AndCondition = "";
  // if (ticketId) {
  //   AndCondition = `AND dce.id="${String(ticketId)}"`;
  // }

  const ticketLines = await get_ticket_lines({
    where: ` WHERE idtypedoc = 21  AND dce.id = "${ticketId}"`,
  });
  const ticketPaiements = await get_ticket_paiements({
    where: ` WHERE dce.id = "${ticketId}"`,
  });

  return (
    // lg:overflow-y-hidden min-w-min
    <div className="h-screen  ">
      <Container
        clients={JSON.parse(clients)}
        collaborateurs={JSON.parse(collaborateurs)}
        ticketLines={JSON.parse(ticketLines as string)}
        ticketPaiements={JSON.parse(ticketPaiements as string)}
        agendas={JSON.parse(agendas)}
        prestations={JSON.parse(prestations)}
      />
    </div>
  );
}
