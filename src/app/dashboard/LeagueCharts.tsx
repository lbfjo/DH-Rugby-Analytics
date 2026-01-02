"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TrendLineChart } from "@/components/charts/TrendLineChart";

interface ChartData {
  round: number;
  avgPoints: number;
  avgTries: number;
  totalPenalties: number;
  avgEffectiveTime: number;
  [key: string]: number;
}

interface LeagueChartsProps {
  data: ChartData[];
}

export function LeagueCharts({ data }: LeagueChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pontos por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart
            data={data}
            lines={[
              { dataKey: "avgPoints", name: "Média Pontos/Jogo", color: "#16a34a" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ensaios por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart
            data={data}
            lines={[
              { dataKey: "avgTries", name: "Média Ensaios/Jogo", color: "#2563eb" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Penalidades Totais por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart
            data={data}
            lines={[
              { dataKey: "totalPenalties", name: "Total Penalidades", color: "#dc2626" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempo Útil Médio por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart
            data={data}
            lines={[
              { dataKey: "avgEffectiveTime", name: "Tempo Útil (min)", color: "#9333ea" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
