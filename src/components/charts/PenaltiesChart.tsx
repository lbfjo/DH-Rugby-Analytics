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
} from "recharts";

interface PenaltyData {
  name: string;
  ruckDefensivo: number;
  ruckAtacante: number;
  foraDeJogo: number;
  placagem: number;
  alMaul: number;
  scrum: number;
  outras: number;
}

interface PenaltiesChartProps {
  data: PenaltyData[];
  height?: number | string;
}

export function PenaltiesChart({ data, height = "100%" }: PenaltiesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 10 }} width={25} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "9px" }} />
        <Bar dataKey="ruckDefensivo" name="Ruck D" stackId="a" fill="#ef4444" />
        <Bar dataKey="ruckAtacante" name="Ruck A" stackId="a" fill="#f97316" />
        <Bar dataKey="foraDeJogo" name="Offside" stackId="a" fill="#eab308" />
        <Bar dataKey="placagem" name="Plac." stackId="a" fill="#22c55e" />
        <Bar dataKey="alMaul" name="AL" stackId="a" fill="#3b82f6" />
        <Bar dataKey="scrum" name="Scr" stackId="a" fill="#8b5cf6" />
        <Bar dataKey="outras" name="Outr" stackId="a" fill="#6b7280" />
      </BarChart>
    </ResponsiveContainer>
  );
}
