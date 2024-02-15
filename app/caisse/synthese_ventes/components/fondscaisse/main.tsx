"use client";
import React, { useEffect, useState } from "react";

export default function FondsCaisse({ fondsCaisseData, viewType }: any) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let filteredData = fondsCaisseData;
    if (viewType === "yearly") {
      filteredData = fondsCaisseData.filter(
        (item: any) => item.line_total !== 0
      );
    }
    setData(filteredData);
  }, [fondsCaisseData, viewType]);
  return (
    <div className="space-y-4 ">
      <div className="overflow-x-auto ">
        <table className="w-full ">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 border rounded-tl-lg">Date</th>
              <th className="p-4 border">Montant à l&apos;ouverture</th>
              <th className="p-4 border">Retrait exceptionnel</th>
              <th className="p-4 border">Dépôt</th>
              <th className="p-4 border">Remise en Banque </th>
              <th className="p-4 border">Espèces encaissée</th>
              <th className="p-4 border">Régularisation</th>
              <th className="p-4 rounded-tr-lg">Montant à la fermeture</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((data: any, index: number) => (
              <tr
                key={index}
                className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
              >
                <td className="p-4 text-slate-800">
                  {data?.day ?? data?.month_name}
                </td>
                <td className="p-4 text-slate-800"></td>
                <td className="p-4 text-slate-800">{data?.total_retrait}</td>
                <td className="p-4 text-slate-800">{data?.total_depot}</td>
                <td className="p-4 text-slate-800">
                  {data?.total_remise_en_bq}
                </td>
                <td className="p-4 text-slate-800">{data?.total_espece}</td>
                <td className="p-4 text-slate-800"></td>
                <td className="p-4 text-slate-800"></td>
                {/* <td className="p-4 text-slate-800">{data?.line_total}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
