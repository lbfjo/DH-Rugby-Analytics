import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MatchComparison } from "./MatchComparison";
import { MatchInsights } from "@/components/insights/MatchInsights";
import Link from "next/link";
import { formatTime, formatPercent } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team1: true,
      team2: true,
      teamStats: {
        include: { team: true },
      },
    },
  });

  if (!match) {
    notFound();
  }

  const team1Stats = match.teamStats.find((ts) => ts.teamId === match.team1Id);
  const team2Stats = match.teamStats.find((ts) => ts.teamId === match.team2Id);

  const team1Won = match.pointsTeam1 > match.pointsTeam2;
  const team2Won = match.pointsTeam2 > match.pointsTeam1;

  // Comparison data for chart
  const comparisonData = [
    { stat: "Pontos", team1: match.pointsTeam1, team2: match.pointsTeam2 },
    { stat: "Ensaios", team1: match.triesTeam1, team2: match.triesTeam2 },
    { stat: "Scrums", team1: match.scrumsTeam1, team2: match.scrumsTeam2 },
    { stat: "Alinhamentos", team1: match.lineoutsTeam1, team2: match.lineoutsTeam2 },
    { stat: "Penalidades", team1: match.penaltiesTeam1, team2: match.penaltiesTeam2 },
  ];

  // Prepare insights data
  const insightsData = {
    team1Name: match.team1.name,
    team2Name: match.team2.name,
    pointsTeam1: match.pointsTeam1,
    pointsTeam2: match.pointsTeam2,
    triesTeam1: match.triesTeam1,
    triesTeam2: match.triesTeam2,
    ruckSuccessTeam1: match.ruckSuccessTeam1,
    ruckSuccessTeam2: match.ruckSuccessTeam2,
    penaltiesTeam1: match.penaltiesTeam1,
    penaltiesTeam2: match.penaltiesTeam2,
    penaltiesDefensiveRuck: match.penaltiesDefensiveRuck,
    penaltiesAttackingRuck: match.penaltiesAttackingRuck,
    penaltiesOffside: match.penaltiesOffside,
    penaltiesTackle: match.penaltiesTackle,
    scrumsTeam1: match.scrumsTeam1,
    scrumsTeam2: match.scrumsTeam2,
    totalScrums: match.totalScrums,
    lineoutsTeam1: match.lineoutsTeam1,
    lineoutsTeam2: match.lineoutsTeam2,
    totalLineouts: match.totalLineouts,
    effectiveTimeSeconds: match.effectiveTimeSeconds,
    triesFromLineout: match.triesFromLineout,
    triesFromScrum: match.triesFromScrum,
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Link
          href="/matches"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm md:text-base"
        >
          &larr; Jogos
        </Link>
        <Badge>Jornada {match.round}</Badge>
        {match.referee && (
          <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">Árbitro: {match.referee}</span>
        )}
      </div>

      {/* Score Card */}
      <Card>
        <CardContent className="py-4 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
            {/* Mobile: Score first, then teams */}
            <div className="text-center order-1 md:order-2">
              <div className="flex items-center gap-2 md:gap-4">
                <span
                  className={`text-3xl md:text-5xl font-bold ${
                    team1Won ? "text-green-600" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {match.pointsTeam1}
                </span>
                <span className="text-xl md:text-3xl text-gray-400">-</span>
                <span
                  className={`text-3xl md:text-5xl font-bold ${
                    team2Won ? "text-green-600" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {match.pointsTeam2}
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                Tempo útil: {formatTime(match.effectiveTimeSeconds)}
              </p>
            </div>

            {/* Teams - Side by side on mobile, flanking score on desktop */}
            <div className="flex md:contents justify-between w-full order-2 md:order-1 mt-3 md:mt-0">
              <div className="text-center flex-1 md:order-1">
                <Link
                  href={`/teams/${encodeURIComponent(match.team1.name)}`}
                  className="hover:text-green-600"
                >
                  <h2
                    className={`text-base md:text-2xl font-bold ${
                      team1Won ? "text-green-600" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {match.team1.name}
                  </h2>
                </Link>
                {team1Won && (
                  <Badge variant="success" className="mt-1 md:mt-2 text-[10px] md:text-xs">
                    Vencedor
                  </Badge>
                )}
              </div>

              <div className="text-center flex-1 md:order-3">
                <Link
                  href={`/teams/${encodeURIComponent(match.team2.name)}`}
                  className="hover:text-green-600"
                >
                  <h2
                    className={`text-base md:text-2xl font-bold ${
                      team2Won ? "text-green-600" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {match.team2.name}
                  </h2>
                </Link>
                {team2Won && (
                  <Badge variant="success" className="mt-1 md:mt-2 text-[10px] md:text-xs">
                    Vencedor
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <MatchInsights data={insightsData} />

      {/* Stats Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] md:h-[250px]">
              <MatchComparison
                data={comparisonData}
                team1Name={match.team1.name}
                team2Name={match.team2.name}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Detalhadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-4">
              <StatRow
                label="Ensaios"
                value1={match.triesTeam1}
                value2={match.triesTeam2}
              />
              <StatRow
                label="Ruck Sucesso"
                value1={formatPercent(match.ruckSuccessTeam1)}
                value2={formatPercent(match.ruckSuccessTeam2)}
                highlight={match.ruckSuccessTeam1 > match.ruckSuccessTeam2 ? 1 : 2}
              />
              <StatRow
                label="Scrums Ganhos"
                value1={match.scrumsTeam1}
                value2={match.scrumsTeam2}
                total={match.totalScrums}
              />
              <StatRow
                label="Alinhamentos"
                value1={match.lineoutsTeam1}
                value2={match.lineoutsTeam2}
                total={match.totalLineouts}
              />
              <StatRow
                label="Penalidades"
                value1={match.penaltiesTeam1}
                value2={match.penaltiesTeam2}
                highlight={match.penaltiesTeam1 < match.penaltiesTeam2 ? 1 : 2}
                lowerIsBetter
              />
              <StatRow label="Jogo ao Pé" value1={match.kickingGame} value2="-" />
              <StatRow label="Rucks Totais" value1={match.totalRucks} value2="-" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Penalties Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Penalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <div className="text-center p-2 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {match.penaltiesDefensiveRuck}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Ruck Def.</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-orange-600">
                {match.penaltiesAttackingRuck}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Ruck Ataq.</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {match.penaltiesOffside}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Fora de Jogo</p>
            </div>
            <div className="text-center p-2 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {match.penaltiesTackle}
              </p>
              <p className="text-xs md:text-sm text-gray-500">Placagem</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Set Piece Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Set-Piece</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base">
                Ensaios de Set-Piece
              </h4>
              <div className="flex gap-2 md:gap-4">
                <div className="flex-1 text-center p-2 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                    {match.triesFromLineout}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">Alinhamento</p>
                </div>
                <div className="flex-1 text-center p-2 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">
                    {match.triesFromScrum}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">Scrum</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3 text-sm md:text-base">
                Domínio de Set-Piece
              </h4>
              <div className="space-y-2 md:space-y-3">
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Scrums</span>
                    <span>
                      {match.scrumsTeam1}/{match.totalScrums} vs{" "}
                      {match.scrumsTeam2}/{match.totalScrums}
                    </span>
                  </div>
                  <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(match.scrumsTeam1 / match.totalScrums) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{
                        width: `${(match.scrumsTeam2 / match.totalScrums) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span>Alinhamentos</span>
                    <span>
                      {match.lineoutsTeam1}/{match.totalLineouts} vs{" "}
                      {match.lineoutsTeam2}/{match.totalLineouts}
                    </span>
                  </div>
                  <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(match.lineoutsTeam1 / match.totalLineouts) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{
                        width: `${(match.lineoutsTeam2 / match.totalLineouts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatRow({
  label,
  value1,
  value2,
  total,
  highlight,
  lowerIsBetter,
}: {
  label: string;
  value1: number | string;
  value2: number | string;
  total?: number;
  highlight?: 1 | 2;
  lowerIsBetter?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-100 dark:border-gray-700">
      <span
        className={`font-medium text-sm md:text-base ${
          highlight === 1 ? "text-green-600" : "text-gray-900 dark:text-white"
        }`}
      >
        {value1}
        {total && (
          <span className="text-gray-400 text-xs md:text-sm">/{total}</span>
        )}
      </span>
      <span className="text-gray-500 text-xs md:text-sm">{label}</span>
      <span
        className={`font-medium text-sm md:text-base ${
          highlight === 2 ? "text-green-600" : "text-gray-900 dark:text-white"
        }`}
      >
        {value2}
        {total && typeof value2 === "number" && (
          <span className="text-gray-400 text-xs md:text-sm">/{total}</span>
        )}
      </span>
    </div>
  );
}
