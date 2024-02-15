"use client";
import React, { useEffect, useState } from "react";

export default function Tickets({ ticketsData, viewType, date }: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = ticketsData;
    if (viewType === "yearly") {
      filteredData = ticketsData.filter((item: any) => item.mntttc !== null);
    }
    setData(filteredData);
    console.log("ticketsData", ticketsData);
  }, [ticketsData, viewType]);
  return (
    <div className="space-y-4 ">
      <div className="overflow-x-auto ">
        <table className="w-full ">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 border rounded-tl-lg">N° Ticket</th>
              <th className="p-4 border">Date Création</th>
              <th className="p-4 border">Client</th>
              <th className="p-4 border">Total HT</th>
              <th className="p-4 border">Total TVA</th>
              <th className="p-4 border">Total TTC</th>
              <th className="p-4 border">Rest à payer</th>
              <th className="p-4 border">Responsable</th>
              <th className="p-4 rounded-tr-lg">Statut</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((data: any, index: number) => (
              <tr
                key={index}
                className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
              >
                <td className="p-4 text-slate-800">{data?.Num_ticket}</td>
                <td className="p-4 text-slate-800">
                  {data?.date_creation.slice(0, 10)}
                </td>
                <td className="p-4 text-slate-800">{data?.client}</td>
                <td className="p-4 text-slate-800">{data?.total_ht}</td>
                <td className="p-4 text-slate-800">{data?.total_tva}</td>
                <td className="p-4 text-slate-800">{data?.total_ttc}</td>
                <td className="p-4 text-slate-800">{data?.restePayer}</td>
                <td className="p-4 text-slate-800">
                  {data?.responsable ?? ""}
                </td>
                <td className="p-4 text-slate-800">{data?.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
