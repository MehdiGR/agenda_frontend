import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { get_synths_chiffre_affaires } from "@/app/lib/ticket/ticketActions";
import {
  Chart,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the type for your chart data
type ChartDataType = ChartData<"bar", number[], string>;

const ChartComponent = ({
  viewType,
  date,
}: {
  viewType: string;
  date: string;
}) => {
  // Use the ChartDataType for your chartData state
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await get_synths_chiffre_affaires({
        date,
        viewType,
      });
      const data = JSON.parse(response as string);

      const labels = data.map((item: any) => item.day || item.month_name);
      const total_ht = data.map((item: any) => item.total_ht);
      const total_ttc = data.map((item: any) => item.total_ttc);
      console.log("total_ttc", total_ttc);
      setChartData({
        labels,
        datasets: [
          {
            label: "Total TTC",
            data: total_ttc,
            backgroundColor: "#43766C",
          },
        ],
      });
    };

    fetchData();
  }, [viewType, date]);

  return (
    <Bar
      data={chartData}
      options={{
        elements: {
          bar: {
            borderWidth: 1,
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
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  );
};

export default ChartComponent;
