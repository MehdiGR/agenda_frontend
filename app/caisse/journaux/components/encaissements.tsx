"use client";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useSearchParams } from "next/navigation";

export default function Encaissements({ data }: any) {
  const [tickets, setTickets] = useState(data);
  useEffect(() => {
    setTickets(data);
  }, [data]);
  const searchParams = useSearchParams();
  const date =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `encaissement_${date}`,
    // sheet: "/",
  });
  return (
    <div className="space-y-4 ">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded flex ml-auto "
        onClick={onDownload}
      >
        Exporter
      </button>
      <table
        className="w-full overflow-auto bg-white rounded-md p-6 shadow-md "
        ref={tableRef}
      >
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4  rounded-tl-lg">N° Ticket</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Client</th>
            <th className="p-4 border">Moyen paiement</th>
            <th className="p-4 border">Montant paiement</th>
            <th className="p-4  rounded-tr-lg">Vendeur</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tickets.length > 0 &&
            tickets.map((ticket: any, index: number) => (
              <tr
                key={index}
                className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
              >
                <td className="p-4 text-slate-800">{ticket?.Num_ticket}</td>
                <td className="p-4 text-slate-800">
                  {ticket?.date_creation.slice(0, 10)}
                </td>
                <td className="p-4 text-slate-800">{ticket?.client}</td>
                <td className="p-4 text-slate-800">{ticket?.mode_paiement}</td>
                <td className="p-4 text-slate-800">
                  {Number(ticket?.montant)}
                </td>
                <td className="p-4 text-slate-800 ">{ticket.vendeur}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
