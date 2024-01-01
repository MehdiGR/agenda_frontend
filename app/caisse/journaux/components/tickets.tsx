"use client";
import React, { useEffect, useState } from "react";

export default function Tickets({ data, valueDate }: any) {
  const [tickets, setTickets] = useState(data);
  useEffect(() => {
    setTickets(
      data.filter((ticketLine: any) => {
        const ticketDate = new Date(ticketLine?.date_creation);
        console.log("ticketDate", valueDate);
        console.log("ticketDate", valueDate);
        return (
          ticketDate.toISOString().slice(0, 10) ===
          valueDate.toISOString().slice(0, 10)
        );
      })
    );
  }, [data, valueDate]);
  return (
    <div className="space-y-4">
      <div className="p-2"></div>
      <table className="w-full overflow-auto border">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 border">N° Ticket</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Client</th>
            <th className="p-4 border">Total HT</th>
            <th className="p-4 border">Total TVA</th>
            <th className="p-4 border">Total TTC</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tickets.map((ticketLine: any, index: number) => (
            <tr
              key={index}
              className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
            >
              <td className="p-4 text-slate-800">{ticketLine?.Num_ticket}</td>
              <td className="p-4 text-slate-800">
                {ticketLine?.date_creation.slice(0, 10)}
              </td>
              <td className="p-4 text-slate-800">{ticketLine?.client}</td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mntht)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mnttva)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mntttc)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
