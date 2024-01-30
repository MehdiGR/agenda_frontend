"use client";
import React, { useEffect, useState } from "react";
import ChartComponent from "./chart";

export default function ChiffreAffaire({ dataProps, viewType, date }: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = dataProps;
    if (viewType === "yearly") {
      filteredData = dataProps.filter((item: any) => item.total_ttc !== null);
    }
    setData(filteredData);
  }, [dataProps, viewType]);
  return (
    <div className="space-y-4 ">
      <div className="p-2 w-full  h-[500px]">
        <ChartComponent viewType={viewType} date={"2024-01-01"} />
      </div>
      <table className="w-full overflow-auto ">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 border">Date Creation</th>
            {/* <th className="p-4 border">Prestations</th> */}
            <th className="p-4 border">Total HT</th>
            {/* <th className="p-4 border">Total TVA</th> */}
            <th className="p-4 border">Total TTC</th>
            <th className="p-4 rounded-tr-lg">Statut</th>
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
              <td className="p-4 text-slate-800">{Number(data?.total_ht)}</td>
              {/* <td className="p-4 text-slate-800">{Number(data?.mnttva)}</td> */}
              <td className="p-4 text-slate-800">{Number(data?.total_ttc)}</td>
              <td className="p-4 text-slate-800">{data.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
