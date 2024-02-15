"use client";
import React, { useEffect, useState } from "react";

export default function DetailTVA({ detailTvaData, viewType }: any) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let filteredData = detailTvaData;
    if (viewType === "yearly") {
      filteredData = detailTvaData.filter((item: any) => item.total_ttc !== 0);
    }
    setData(filteredData);
  }, [detailTvaData, viewType]);
  return (
    <div className="space-y-4 ">
      <div className="overflow-x-auto ">
        <table className="w-full ">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4 border rounded-tl-lg">Date</th>
              <th className="p-4 border">Prestations 0% HT</th>
              <th className="p-4 border">Prestations 20% HT</th>
              <th className="p-4 border">Prestations 21% HT </th>
              <th className="p-4 border">Produits 0% HT</th>
              <th className="p-4 border">Produits 20% HT</th>
              <th className="p-4 border">Produits 21% HT </th>
              <th className="p-4 border ">Total HT</th>
              <th className="p-4 border ">TVA 0%</th>
              <th className="p-4 border ">TVA 20%</th>
              <th className="p-4 border ">TVA 21%</th>
              <th className="p-4 border rounded-tr-lg">Total TTC</th>
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
                  {data?.total_prestations_tva_0}
                </td>
                <td className="p-4 text-slate-800">
                  {data?.total_prestations_tva_20}
                </td>
                <td className="p-4 text-slate-800">
                  {data?.total_prestations_tva_21}
                </td>
                <td className="p-4 text-slate-800">
                  {data?.total_produits_tva_0}
                </td>
                <td className="p-4 text-slate-800">
                  {data?.total_produits_tva_20}
                </td>
                <td className="p-4 text-slate-800">
                  {data?.total_produits_tva_21}
                </td>
                <td className="p-4 text-slate-800">{data?.total_ht}</td>
                <td className="p-4 text-slate-800">{data?.total_tva_v0}</td>
                <td className="p-4 text-slate-800">{data?.total_tva_v20}</td>
                <td className="p-4 text-slate-800">{data?.total_tva_v21}</td>
                <td className="p-4 text-slate-800">{data?.total_ttc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
