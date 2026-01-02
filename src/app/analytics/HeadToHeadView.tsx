"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TeamStats } from "./AnalyticsDashboard";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  team1: TeamStats;
  team2: TeamStats;
}

export function HeadToHeadView({ team1, team2 }: Props) {
  // 1. Radar Data (Percentages)
  const radarData = [
    {
      subject: "Possession",
      A: Math.round(team1.avg.possession),
      B: Math.round(team2.avg.possession),
      fullMark: 100,
    },
    {
      subject: "Tackle Success",
      A: Math.round(team1.avg.tackleSuccess),
      B: Math.round(team2.avg.tackleSuccess),
      fullMark: 100,
    },
    {
      subject: "Ruck Success",
      A: Math.round(team1.avg.ruckSuccess),
      B: Math.round(team2.avg.ruckSuccess),
      fullMark: 100,
    },
    {
      subject: "Lineout Success",
      A: Math.round(team1.avg.lineoutSuccess),
      B: Math.round(team2.avg.lineoutSuccess),
      fullMark: 100,
    },
    {
      subject: "Scrum Success",
      A: Math.round(team1.avg.scrumSuccess),
      B: Math.round(team2.avg.scrumSuccess),
      fullMark: 100,
    },
  ];

  // 2. Attack Metrics
  const attackData = [
    {
      metric: "Points",
      [team1.teamName]: Number(team1.avg.pointsScored.toFixed(1)),
      [team2.teamName]: Number(team2.avg.pointsScored.toFixed(1)),
    },
    {
      metric: "Tries",
      [team1.teamName]: Number(team1.avg.triesScored.toFixed(1)),
      [team2.teamName]: Number(team2.avg.triesScored.toFixed(1)),
    },
    {
      metric: "Line Breaks",
      [team1.teamName]: Number(team1.avg.lineBreaks.toFixed(1)),
      [team2.teamName]: Number(team2.avg.lineBreaks.toFixed(1)),
    },
  ];

  // 3. Discipline (Lower is better usually, but we chart magnitude)
  const disciplineData = [
    {
      metric: "Penalties Avg",
      [team1.teamName]: Number(team1.avg.penalties.toFixed(1)),
      [team2.teamName]: Number(team2.avg.penalties.toFixed(1)),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Profile (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={team1.teamName}
                  dataKey="A"
                  stroke="#15803d" // green-700
                  fill="#15803d"
                  fillOpacity={0.3}
                />
                <Radar
                  name={team2.teamName}
                  dataKey="B"
                  stroke="#2563eb" // blue-600
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attack Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Attack Metrics (Avg per game)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attackData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey={team1.teamName} fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey={team2.teamName} fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-3 text-left font-medium text-gray-500">Metric</th>
                  <th className="py-3 text-center font-bold text-green-700">{team1.teamName}</th>
                  <th className="py-3 text-center font-bold text-blue-600">{team2.teamName}</th>
                  <th className="py-3 text-right font-medium text-gray-500">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800">
                <Row label="Points Scored (Avg)" v1={team1.avg.pointsScored} v2={team2.avg.pointsScored} />
                <Row label="Points Conceded (Avg)" v1={team1.avg.pointsConceded} v2={team2.avg.pointsConceded} inverse />
                <Row label="Tries Scored (Avg)" v1={team1.avg.triesScored} v2={team2.avg.triesScored} />
                <Row label="Penalties Conceded (Avg)" v1={team1.avg.penalties} v2={team2.avg.penalties} inverse />
                <Row label="Possession %" v1={team1.avg.possession} v2={team2.avg.possession} isPercent />
                <Row label="Tackle Success %" v1={team1.avg.tackleSuccess} v2={team2.avg.tackleSuccess} isPercent />
                <Row label="Lineout Success %" v1={team1.avg.lineoutSuccess} v2={team2.avg.lineoutSuccess} isPercent />
                <Row label="Scrum Success %" v1={team1.avg.scrumSuccess} v2={team2.avg.scrumSuccess} isPercent />
                <Row label="Line Breaks (Avg)" v1={team1.avg.lineBreaks} v2={team2.avg.lineBreaks} />
                <Row label="Kicks in Play (Avg)" v1={team1.avg.kicks} v2={team2.avg.kicks} />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ 
  label, 
  v1, 
  v2, 
  isPercent = false, 
  inverse = false // true if lower is better (e.g. penalties, points conceded)
}: { 
  label: string; 
  v1: number; 
  v2: number; 
  isPercent?: boolean;
  inverse?: boolean;
}) {
  const diff = v1 - v2;
  const isBetter = inverse ? diff < 0 : diff > 0;
  const isEqual = Math.abs(diff) < 0.01;
  
  const format = (n: number) => isPercent ? `${n.toFixed(0)}%` : n.toFixed(1);
  const formatDiff = (n: number) => {
    const prefix = n > 0 ? "+" : "";
    return isPercent ? `${prefix}${n.toFixed(0)}%` : `${prefix}${n.toFixed(1)}`;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{label}</td>
      <td className="py-3 text-center text-gray-700 dark:text-gray-300">{format(v1)}</td>
      <td className="py-3 text-center text-gray-700 dark:text-gray-300">{format(v2)}</td>
      <td className={`py-3 text-right font-medium ${
        isEqual 
          ? "text-gray-400" 
          : isBetter 
            ? "text-green-600" 
            : "text-red-600"
      }`}>
        {formatDiff(diff)}
      </td>
    </tr>
  );
}
