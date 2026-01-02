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
  height?: number;
}

export function PenaltiesChart({ data, height = 300 }: PenaltiesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="ruckDefensivo" name="Ruck Def." stackId="a" fill="#ef4444" />
        <Bar dataKey="ruckAtacante" name="Ruck Ataq." stackId="a" fill="#f97316" />
        <Bar dataKey="foraDeJogo" name="Fora Jogo" stackId="a" fill="#eab308" />
        <Bar dataKey="placagem" name="Placagem" stackId="a" fill="#22c55e" />
        <Bar dataKey="alMaul" name="AL/Maul" stackId="a" fill="#3b82f6" />
        <Bar dataKey="scrum" name="Scrum" stackId="a" fill="#8b5cf6" />
        <Bar dataKey="outras" name="Outras" stackId="a" fill="#6b7280" />
      </BarChart>
    </ResponsiveContainer>
  );
}
