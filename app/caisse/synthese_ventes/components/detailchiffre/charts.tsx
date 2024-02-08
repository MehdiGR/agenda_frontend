import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { get_total_sales_by_article_type } from "@/app/lib/ticket/ticketActions";
import {
  Chart,
  ChartData,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
} from "chart.js";

// Register Chart.js components
Chart.register(Tooltip, Legend, PieController, ArcElement);

// Define the type for your chart data
type PieChartDataType = ChartData<"pie", number[], string>;

const ChartComponent = ({
  salesByArticleType,
}: {
  salesByArticleType: any;
}) => {
  const [pieChartData, setPieChartData] = useState<PieChartDataType>({
    labels: ["Total Prestation", "Total Produits"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#43766C", "#D9D9D9"],
        hoverBackgroundColor: ["#43766C", "#D9D9D9"],
      },
    ],
  });
  useEffect(() => {
    // Pie Chart
    const {
      total_prestations: total_prestation,
      total_products: total_produits,
    } = salesByArticleType[0];
    setPieChartData({
      labels: ["Total Prestations", "Total Produits"],
      datasets: [
        {
          data: [total_prestation, total_produits],
          backgroundColor: ["#44A9A8", "#D9D9D9"],
          hoverBackgroundColor: ["#43766C", "#D9D9D9"],
        },
      ],
    });
  }, [salesByArticleType]);

  return (
    <div
      className="flex-1 bg-gray-600 flex justify-center w-full h-i"
      style={{ height: "300px", width: "500px" }}
    >
      <Pie
        className=" p-6 rounded-md "
        data={pieChartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: {
                color: "#ffffff", // Change text color
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ChartComponent;
