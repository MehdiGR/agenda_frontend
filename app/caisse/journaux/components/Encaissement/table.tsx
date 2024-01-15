"use client";
import React from "react";

export default function TableEncaissement({ tickets }: any) {
  return (
    <div>
      <table className="w-full overflow-auto ">
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
