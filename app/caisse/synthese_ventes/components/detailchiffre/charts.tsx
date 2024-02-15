import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  get_synths_chiffre_affaires,
  get_total_sales_by_article_type,
} from "@/app/lib/ticket/ticketActions";
import {
  Chart,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
} from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement
);

// Define the type for your chart data
type ChartDataType = ChartData<"bar", number[], string>;
type PieChartDataType = ChartData<"pie", number[], string>;

const ChartComponent = ({
  salesByArticleType,
}: {
  salesByArticleType: any;
}) => {
  // Pie Chart
  const total_prestation = salesByArticleType[0].total_ttc;
  const total_produits = salesByArticleType[1].total_ttc;
  const pieChartData: PieChartDataType = {
    labels: ["Total Prestations", "Total Produits"],
    datasets: [
      {
        data: [total_prestation, total_produits],
        backgroundColor: ["#44A9A8", "#D9D9D9"],
        hoverBackgroundColor: ["#43766C", "#D9D9D9"],
      },
    ],
  };

  return (
    <div className="bg-gray-600 flex justify-center w-[400px] h-[300px]">
      <Pie
        className=" p-6 rounded-md "
        data={pieChartData}
        options={{
          animation: {
            duration: 0, // Disable animations
          },
          responsive: true,
          maintainAspectRatio: false, // Adjusted to render correctly according to the parent size
          aspectRatio: 1, // You can adjust this value to meet your specific aspect ratio requirements
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
