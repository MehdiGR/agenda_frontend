"use client";
import React, { useEffect, useState } from "react";

export default function Reglements({ reglementsData, viewType, date }: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = reglementsData;
    if (viewType === "yearly") {
      filteredData = reglementsData.filter(
        (item: any) => item.line_total !== 0
      );
    }
    setData(filteredData);
  }, [reglementsData, viewType]);
  return (
    <div className="space-y-4 ">
      <div className="overflow-x-auto ">
        <table className="w-full ">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 border rounded-tl-lg">Date</th>
              <th className="p-4 border rounded-">Carte Bancaire</th>
              <th className="p-4 border rounded-">Chèque</th>
              <th className="p-4 border rounded-">Espèce </th>
              <th className="p-4 rounded-tr-lg">Total TTC</th>
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
                <td className="p-4 text-slate-800">
                  {data?.total_carte_bancaire}
                </td>
                <td className="p-4 text-slate-800">{data?.total_espece}</td>
                <td className="p-4 text-slate-800">{data?.total_cheque}</td>
                <td className="p-4 text-slate-800">{data?.line_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
