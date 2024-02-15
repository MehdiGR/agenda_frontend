"use client";
import React, { useEffect, useState } from "react";
import ChartComponent from "./charts";
import { LiaSearchPlusSolid } from "react-icons/lia";

export default function DetailChiffre({ salesByArticleType, viewType }: any) {
  // Separate the data into prestations and products arrays
  const [prestations, setPrestations] = useState<any>(salesByArticleType[0]); // Replace 'any' with a more specific type if possible
  const [products, setProducts] = useState<any>(salesByArticleType[1]); // Replace 'any' with a more specific type if possible
  const [showChart, setShowChart] = useState(false);
  const [currentChartData, setCurrentChartData] = useState(null);
  console.log("salesByArticleType", salesByArticleType);
  useEffect(() => {
    setPrestations(salesByArticleType[0]);
    setProducts(salesByArticleType[1]);
  }, [salesByArticleType, viewType]);

  const generateNewChart = (data) => {
    setShowChart(true);
    setCurrentChartData(data);
  };

  return (
    <div className="space-y-4  w-full ">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 lg:place-items-start md:place-items-center justify-around gap-3">
        <table className="overflow-auto max-w-fit  h-[100px]">
          <thead className="bg-slate-800 text-white ">
            <tr>
              <th className="p-2 border "></th>
              <th className="p-2 border">Types</th>
              <th className="p-2 border">Total HT</th>
              <th className="p-2 border">Total TVA</th>
              <th className="p-2 border">Total TTC</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {prestations && (
              <tr className=" even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition ">
                <td
                  className="p-2 text-slate-800 cursor-pointer"
                  onClick={() => generateNewChart(prestations)}
                >
                  <LiaSearchPlusSolid size="24" />
                </td>
                <td className="p-2 text-slate-800">{prestations?.type}</td>
                <td className="p-2 text-slate-800">
                  {Number(prestations?.total_ht)}
                </td>
                <td className="p-2 text-slate-800">
                  {Number(prestations?.total_tva)}
                </td>
                <td className="p-2 text-slate-800">
                  {Number(prestations?.total_ttc)}
                </td>
              </tr>
            )}
            {products && (
              <tr className=" even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition ">
                <td
                  className="p-2 text-slate-800 cursor-pointer"
                  onClick={() => generateNewChart(products)}
                >
                  <LiaSearchPlusSolid size="24" />
                </td>
                <td className="p-2 text-slate-800">{products?.type}</td>
                <td className="p-2 text-slate-800">
                  {Number(products?.total_ht)}
                </td>
                <td className="p-2 text-slate-800">
                  {Number(products?.total_tva)}
                </td>
                <td className="p-2 text-slate-800">
                  {Number(products?.total_ttc)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className=" ">
          <ChartComponent salesByArticleType={salesByArticleType} />
        </div>
      </div>
      <div className="  w-full">
        <hr className="w-full py-2 bold" />
        {showChart && (
          <div className="flex justify-center  w-full overflow-x-auto">
            <table className="overflow-auto min-w-fit  h-[100px]">
              <thead className="bg-slate-800 text-white ">
                <tr>
                  <th className="p-2 border"></th>
                  <th className="p-2 border">Types</th>
                  <th className="p-2 border">Total HT</th>
                  <th className="p-2 border">Total TVA</th>
                  <th className="p-2 border">Total TTC</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {prestations && (
                  <tr className=" even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition ">
                    <td
                      className="p-2 text-slate-800 cursor-pointer"
                      onClick={() => generateNewChart(prestations)}
                    >
                      <LiaSearchPlusSolid size="24" />
                    </td>
                    <td className="p-2 text-slate-800">{prestations?.type}</td>
                    <td className="p-2 text-slate-800">
                      {Number(prestations?.total_ht)}
                    </td>
                    <td className="p-2 text-slate-800">
                      {Number(prestations?.total_tva)}
                    </td>
                    <td className="p-2 text-slate-800">
                      {Number(prestations?.total_ttc)}
                    </td>
                  </tr>
                )}
                {products && (
                  <tr className=" even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition ">
                    <td
                      className="p-2 text-slate-800 cursor-pointer"
                      onClick={() => generateNewChart(products)}
                    >
                      <LiaSearchPlusSolid size="24" />
                    </td>
                    <td className="p-2 text-slate-800">{products?.type}</td>
                    <td className="p-2 text-slate-800">
                      {Number(products?.total_ht)}
                    </td>
                    <td className="p-2 text-slate-800">
                      {Number(products?.total_tva)}
                    </td>
                    <td className="p-2 text-slate-800">
                      {Number(products?.total_ttc)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center  w-full ">
              <ChartComponent salesByArticleType={salesByArticleType} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
