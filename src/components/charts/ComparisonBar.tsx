"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface ComparisonData {
  stat: string;
  team1: number;
  team2: number;
}

interface ComparisonBarProps {
  data: ComparisonData[];
  team1Name: string;
  team2Name: string;
  height?: number | string;
}

export function ComparisonBar({
  data,
  team1Name,
  team2Name,
  height = "100%",
}: ComparisonBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis dataKey="stat" type="category" tick={{ fontSize: 9 }} width={65} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "10px" }} />
        <Bar dataKey="team1" name={team1Name} fill="#16a34a" />
        <Bar dataKey="team2" name={team2Name} fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}
