import React, { useState, useEffect } from "react";
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
  salesData,
  salesByArticleType,
}: {
  salesData: any;
  salesByArticleType: any;
}) => {
  // console.log("date", date);
  // Use the ChartDataType for your chartData state
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  });
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
    const labels = salesData.map((item: any) => item.day || item.month_name);
    const total_ht = salesData.map((item: any) => item.total_ht);
    const total_ttc = salesData.map((item: any) => item.total_ttc);
    setChartData({
      labels,
      datasets: [
        {
          label: "Total TTC",
          data: total_ttc,
          backgroundColor: "#44A9A8",
        },
      ],
    });

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
  }, [salesData, salesByArticleType]);

  return (
    <div className="flex flex-wrap  justify-around gap-10 w-full ">
      <div
        className="flex-1 bg-gray-600 text-center flex justify-center"
        style={{ height: "300px", width: "500px" }}
      >
        <Bar
          className=" rounded-sm"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            elements: {
              bar: {
                borderWidth: 1,
                borderColor: "#ffffff",
              },
              point: {
                radius: 0,
              },
            },
            scales: {
              x: {
                type: "category",
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#ffffff", // Change y-axis label color
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#ffffff", // Change y-axis label color
                },
              },
            },
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
    </div>
  );
};

export default ChartComponent;
