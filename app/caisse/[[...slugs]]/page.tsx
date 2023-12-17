// import React from "react";

import Container from "../container";
import { get_reservat_ticket_lines } from "@/app/lib/ticket/ticketActions";
import { notFound } from "next/navigation";
export default async function Caisse({
  params,
}: {
  params: { slugs: string[] };
}) {
  // const { res: idRes } = searchParams;
  let idRes = null;
  if (params && params.slugs) {
    console.log(params.slugs[0], "params slugs");
    const valid_param =
      params.slugs[0] == "reservation" || params.slugs[0] == "ticket";
    // console.log(valid_param, "valid_param");
    // return;

    if (!valid_param && params.slugs.length > 1) {
      console.log(params.slugs.length, "length");
      notFound();
    }
    idRes =
      params.slugs[0] === "reservation"
        ? params.slugs[1]
        : params.slugs[0] === "ticket"
        ? params.slugs[1]
        : null;
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
  // const ticketLines = await get_ticketLines({ Num_ticket: Number(idRes) });
  let AndCondition = "";
  // if (idRes) {
  //   AndCondition = `AND rsv_dc.id_res="${String(idRes)}"`;
  // }
  const ticketLines = await get_reservat_ticket_lines({
    where: ` WHERE idtypedoc = 21  AND mise_en_attente=1 ${AndCondition}`,
  });
  console.log("# ticketLines", ticketLines);

  return (
    // lg:overflow-y-hidden min-w-min
    <div className="h-screen   ">
      <h1>Caisse {idRes ? idRes : ""}</h1>
      {/* <Container
        clients={clients}
        collaborateurs={collaborateurs}
        ticketLines={JSON.parse(ticketLines as string)}
        agendas={agendas}
        prestations={prestations}
      /> */}
    </div>
  );
}
