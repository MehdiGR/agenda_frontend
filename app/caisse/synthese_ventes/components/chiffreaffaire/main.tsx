"use client";
import React, { useEffect, useState } from "react";
import ChartComponent from "./charts";

export default function ChiffreAffaire({
  salesData,
  salesByArticleType,
  viewType,
  date,
}: any) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = salesData;
    if (viewType === "yearly") {
      filteredData = salesData.filter((item: any) => item.total_ttc !== null);
    }
    setData(filteredData);
  }, [salesData, viewType]);
  return (
    <div className="space-y-4 ">
      <ChartComponent
        salesData={salesData}
        salesByArticleType={salesByArticleType}
      />
      <table className="w-full overflow-auto ">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 border">Date Creation</th>
            {/* <th className="p-4 border">Prestations</th> */}
            <th className="p-4 border">Total HT</th>
            <th className="p-4 border">Prestations</th>
            <th className="p-4 border">Produit</th>
            <th className="p-4 border">TVA 0%</th>
            <th className="p-4 border">TVA 20%</th>
            <th className="p-4 border">TVA 21%</th>
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
              <td className="p-4 text-slate-800">
                {Number(data?.total_prestations)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(data?.total_products)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(data?.total_ttc_v0)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(data?.total_ttc_v20)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(data?.total_ttc_v21)}
              </td>
              <td className="p-4 text-slate-800">{Number(data?.total_ttc)}</td>
              <td className="p-4 text-slate-800">{data.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
