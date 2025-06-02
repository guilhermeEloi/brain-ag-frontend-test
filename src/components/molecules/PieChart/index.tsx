import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(ArcElement, ChartTooltip, Legend);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a3e635"];

interface PieChartComponentProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartComponentProps) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: COLORS.slice(0, data.length),
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  return <Pie data={chartData} />;
}
