"use client";
import React, { useEffect, useState } from "react";

export default function ChiffreAffaire({ dataProps }: any) {
  const [data, setData] = useState([]);
  console.log(dataProps);

  useEffect(() => {
    setData(dataProps);
  }, [dataProps]);
  return (
    <div className="space-y-4">
      <div className="p-2"></div>
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
              <td className="p-4 text-slate-800">{data?.day}</td>
              <td className="p-4 text-slate-800">{Number(data?.mntht)}</td>
              {/* <td className="p-4 text-slate-800">{Number(data?.mnttva)}</td> */}
              <td className="p-4 text-slate-800">{Number(data?.mntttc)}</td>
              <td className="p-4 text-slate-800">{data.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
