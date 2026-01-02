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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pontos por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] md:h-[250px]">
            <TrendLineChart
              data={data}
              lines={[
                { dataKey: "avgPoints", name: "Média Pts/Jogo", color: "#16a34a" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ensaios por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] md:h-[250px]">
            <TrendLineChart
              data={data}
              lines={[
                { dataKey: "avgTries", name: "Média Ens/Jogo", color: "#2563eb" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Penalidades por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] md:h-[250px]">
            <TrendLineChart
              data={data}
              lines={[
                { dataKey: "totalPenalties", name: "Total Pen.", color: "#dc2626" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempo Útil por Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] md:h-[250px]">
            <TrendLineChart
              data={data}
              lines={[
                { dataKey: "avgEffectiveTime", name: "Tempo (min)", color: "#9333ea" },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
