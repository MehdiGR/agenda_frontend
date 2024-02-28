// // import React from "react";

// import Container from "./container";
// import { get_reservat_ticket_lines } from "@/app/lib/ticket/ticketActions";

// export default async function Caisse({
//   params,
//   searchParams,
// }: {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   // console.log("searchParams", searchParams);
//   // return;
//   const { res: idRes } = searchParams;
//   const resClt = await fetch("http://localhost:3000/api/client", {
//     cache: "no-store",
//   });
//   const resCollab = await fetch("http://localhost:3000/api/collaborateur", {
//     cache: "no-store",
//   });
//   const resPres = await fetch("http://localhost:3000/api/prestation", {
//     cache: "no-store",
//   });
//   const resAg = await fetch("http://localhost:3000/api/agenda", {
//     cache: "no-store",
//   });

//   const agendas = await resAg.json();
//   const clients = await resClt.json();
//   const collaborateurs = await resCollab.json();
//   const prestations = await resPres.json();
//   // const tickets = await get_tickets({ Num_ticket: Number(idRes) });
//   let AndCondition = "";
//   if (idRes) {
//     AndCondition = `AND rsv_dc.id_res="${String(idRes)}"`;
//   }
//   const tickets = await get_reservat_ticket_lines({
//     where: ` WHERE idtypedoc = 21  AND mise_en_attente=1 ${AndCondition}`,
//   });
//   console.log("# tickets", tickets);

//   return (
//     // lg:overflow-y-hidden min-w-min
//     <div className="h-screen   ">
//       <Container
//         clients={clients}
//         collaborateurs={collaborateurs}
//         ticketLines={JSON.parse(tickets as string)}
//         agendas={agendas}
//         prestations={prestations}
//       />
//     </div>
//   );
// }
