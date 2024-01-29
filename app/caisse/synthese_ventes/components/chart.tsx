import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { get_synths_chiffre_affaires } from "@/app/lib/ticket/ticketActions";
import {
  Chart,
  ChartData,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the type for your chart data
type ChartDataType = ChartData<"line", number[], string>;

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
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      });
    };

    fetchData();
  }, [viewType, date]);

  return (
    <Line
      data={chartData}
      options={{
        elements: {
          line: {
            fill: false, // Ensure the area under the line is not filled
          },
          point: {
            radius: 0, // Hide the points to emphasize the line itself
          },
        },
        scales: {
          x: {
            type: "category",
            grid: {
              display: false, // Optionally hide the grid lines for the X-axis
            },
          },
          y: {
            grid: {
              display: false, // Optionally hide the grid lines for the Y-axis
            },
          },
        },
      }}
    />
  );
};

export default ChartComponent;
