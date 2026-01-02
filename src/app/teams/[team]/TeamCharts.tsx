"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PillarsRadar } from "@/components/charts/PillarsRadar";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { PenaltiesChart } from "@/components/charts/PenaltiesChart";

interface PillarData {
  pillar: string;
  value: number;
  fullMark: number;
}

interface TrendData {
  round: number;
  pointsScored: number;
  pointsConceded: number;
  tries: number;
  ruckSuccess: number;
  tackleSuccess: number;
  penalties: number;
  [key: string]: number;
}

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

interface TeamChartsProps {
  teamName: string;
  pillars: PillarData[];
  trendData: TrendData[];
  penaltiesData: PenaltyData[];
  avgStats: {
    ruckSuccess: number;
    tackleSuccess: number;
    possession: number;
    scrumsWon: number;
    lineoutsWon: number;
  };
}

export function TeamCharts({
  teamName,
  pillars,
  trendData,
  penaltiesData,
  avgStats,
}: TeamChartsProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 4 Pillars Radar */}
        <Card>
          <CardHeader>
            <CardTitle>4 Pilares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] md:h-[300px]">
              <PillarsRadar data={pillars} teamName={teamName} />
            </div>
            <div className="mt-3 md:mt-4 grid grid-cols-2 gap-1.5 md:gap-2 text-xs md:text-sm">
              {pillars.map((p) => (
                <div key={p.pillar} className="flex justify-between">
                  <span className="text-gray-500">{p.pillar}:</span>
                  <span className="font-medium">{Math.round(p.value)}/100</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Médias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <StatBar label="Ruck Sucesso" value={avgStats.ruckSuccess} />
              <StatBar label="Placagem" value={avgStats.tackleSuccess} />
              <StatBar label="Posse" value={avgStats.possession} />
              <StatBar label="Scrums" value={avgStats.scrumsWon} />
              <StatBar label="Alinhamentos" value={avgStats.lineoutsWon} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] md:h-[300px]">
            <TrendLineChart
              data={trendData}
              lines={[
                { dataKey: "pointsScored", name: "Marcados", color: "#16a34a" },
                { dataKey: "pointsConceded", name: "Sofridos", color: "#dc2626" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sucesso por Jornada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] md:h-[300px]">
              <TrendLineChart
                data={trendData}
                lines={[
                  { dataKey: "ruckSuccess", name: "Ruck %", color: "#16a34a" },
                  { dataKey: "tackleSuccess", name: "Placagem %", color: "#2563eb" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penalidades por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] md:h-[300px]">
              <PenaltiesChart data={penaltiesData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  const percentage = value * 100;
  return (
    <div>
      <div className="flex justify-between text-xs md:text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
