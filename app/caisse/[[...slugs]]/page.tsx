// import React from "react";

import Container from "../container";
import {
  get_ticket_lines,
  get_ticket_paiements,
} from "@/app/lib/ticket/ticketActions";
import { notFound } from "next/navigation";
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
        clients={clients}
        collaborateurs={collaborateurs}
        ticketLines={JSON.parse(ticketLines as string)}
        ticketPaiements={JSON.parse(ticketPaiements as string)}
        agendas={agendas}
        prestations={prestations}
      />
    </div>
  );
}
