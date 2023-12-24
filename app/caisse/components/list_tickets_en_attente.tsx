import { get_tickets } from "@/app/lib/ticket/ticketActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

export default async function TicketsEnAttente() {
  const result = await get_tickets({
    where: ` WHERE idtypedoc = 21  AND mise_en_attente=1`,
  });
  const ticketLines = JSON.parse(result as string);

  // const router = useRouter();
  const handleRowClick = (row: any) => {
    // router.push(`/caisse/ticket/${row.id_ticket}`);
    console.log(row);
  };
  return (
    <div className="absolute top-full left-0 bg-white p-4 w-[500px] z-10 rounded-lg transition cursor-pointer-opacity duration-300 leading-[30px] text-slate-900 hover:text-slate-900 shadow-md">
      <h3 className="text-xl font-bold">Tickets en attente paiement</h3>
      <table className="w-full overflow-auto border">
        <thead>
          <tr>
            <th>Date Creation</th>
            <th>Client</th>
            <th>Reste à payer</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {ticketLines?.map((ticketLine: any, index: number) => (
            <tr
              key={index}
              className="p-4 hover:bg-slate-900 hover:text-white transition"

              // onClick={() => startTransition(() => handleRowClick(ticketLine))}
            >
              {/* <Link href={`/caisse/ticket/${ticketLine?.id_ticket}`}> */}{" "}
              <td>{ticketLine?.date_creation.substring(0, 10)}</td>
              <td>{ticketLine?.client}</td>
              <td>{Number(ticketLine?.restePayer.toFixed(2))}</td>
              {/* </Link> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
