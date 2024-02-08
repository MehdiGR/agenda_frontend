"use client";
import React, { useEffect, useState } from "react";
import ChartComponent from "./charts";

export default function DetailChiffre({
  salesByArticleType,
  viewType,
  date,
}: any) {
  // Separate the data into prestations and products arrays
  const [prestations, setPrestations] = useState<any>(null); // Replace 'any' with a more specific type if possible
  const [products, setProducts] = useState<any>(null); // Replace 'any' with a more specific type if possible

  useEffect(() => {
    const separatedData = salesByArticleType.reduce(
      (acc, item) => {
        if (item.type === "prestation") {
          acc.prestations = item;
        } else if (item.type === "product") {
          acc.products = item;
        }
        return acc;
      },
      { prestations: null, products: null }
    );

    setPrestations(separatedData.prestations);
    setProducts(separatedData.products);
  }, [salesByArticleType, viewType]);
  return (
    <div className="space-y-4 ">
      <ChartComponent salesByArticleType={salesByArticleType} />
      <table className="w-full overflow-auto ">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 border">Prestations</th>
            <th className="p-4 border">Produits</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition ">
            <td className="p-4 text-slate-800">
              {Number(prestations?.total_ht)}
            </td>
            <td className="p-4 text-slate-800">
              {products?.day ?? products?.month_name}
            </td>
            <td className="p-4 text-slate-800">{Number(products?.total_ht)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
