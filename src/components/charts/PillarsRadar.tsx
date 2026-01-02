"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PillarData {
  pillar: string;
  value: number;
  fullMark: number;
}

interface PillarsRadarProps {
  data: PillarData[];
  teamName?: string;
  height?: number | string;
}

export function PillarsRadar({ data, teamName = "Equipa", height = "100%" }: PillarsRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
        <PolarAngleAxis
          dataKey="pillar"
          tick={{ fontSize: 10 }}
          className="text-gray-600 dark:text-gray-400"
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "11px",
          }}
        />
        <Radar
          name={teamName}
          dataKey="value"
          stroke="#16a34a"
          fill="#16a34a"
          fillOpacity={0.5}
        />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
