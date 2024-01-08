"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function RowsTicketEnAttente({ ticketLine }: any) {
  const router = useRouter();

  const handleRowClick = (row: any) => {
    router.replace(`/caisse/ticket/${row.ticketId}`);
    console.log(row);
  };
  return (
    <tr
      className="p-4 hover:bg-slate-900 hover:text-white transition"
      onClick={() => handleRowClick(ticketLine)}
    >
      <td>{ticketLine?.date_creation.substring(0, 10)}</td>
      <td>{ticketLine?.client}</td>
      <td>{Number(ticketLine?.restePayer.toFixed(2))}</td>
    </tr>
  );
}
