import { prisma } from "@/lib/db";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { LeagueTable } from "./LeagueTable";
import { RoundFilter } from "./RoundFilter";
import { LeagueCharts } from "./LeagueCharts";

interface Props {
  searchParams: Promise<{ round?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedRound = params.round ? parseInt(params.round) : undefined;

  // Get all rounds available
  const rounds = await prisma.teamRoundStats.findMany({
    select: { round: true },
    distinct: ["round"],
    orderBy: { round: "asc" },
  });
  const availableRounds = rounds.map((r) => r.round);

  // Get league stats
  const matchCount = await prisma.match.count(
    selectedRound ? { where: { round: selectedRound } } : undefined
  );

  const teamCount = await prisma.team.count();

  // Aggregate stats
  const matchAggregates = await prisma.match.aggregate({
    where: selectedRound ? { round: selectedRound } : undefined,
    _sum: {
      totalPoints: true,
      totalTries: true,
      totalPenalties: true,
    },
    _avg: {
      effectiveTimeSeconds: true,
      totalRucks: true,
    },
  });

  // Get league table data
  const teamStats = await prisma.teamRoundStats.groupBy({
    by: ["teamId"],
    where: selectedRound ? { round: { lte: selectedRound } } : undefined,
    _sum: {
      matchPoints: true,
      pointsScored: true,
      pointsConceded: true,
      triesScored: true,
      triesConceded: true,
    },
    _count: {
      round: true,
    },
  });

  // Get teams with group info
  const teams = await prisma.team.findMany();
  const teamMap = new Map(teams.map((t) => [t.id, { name: t.name, group: t.groupName }]));

  const leagueTable = teamStats
    .map((ts) => {
      const teamInfo = teamMap.get(ts.teamId);
      return {
        teamId: ts.teamId,
        teamName: teamInfo?.name || "Unknown",
        groupName: teamInfo?.group || "A",
        played: ts._count.round,
        points: ts._sum.matchPoints || 0,
        pointsFor: ts._sum.pointsScored || 0,
        pointsAgainst: ts._sum.pointsConceded || 0,
        pointsDiff: (ts._sum.pointsScored || 0) - (ts._sum.pointsConceded || 0),
        triesFor: ts._sum.triesScored || 0,
        triesAgainst: ts._sum.triesConceded || 0,
      };
    })
    .sort((a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff);

  // Group tables by group
  const groupA = leagueTable
    .filter((t) => t.groupName === "A")
    .sort((a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff);
  const groupB = leagueTable
    .filter((t) => t.groupName === "B")
    .sort((a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff);
  const groupC = leagueTable
    .filter((t) => t.groupName === "C")
    .sort((a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff);

  // Get data for charts
  const roundStats = await prisma.match.groupBy({
    by: ["round"],
    _avg: {
      totalPoints: true,
      totalTries: true,
      effectiveTimeSeconds: true,
    },
    _sum: {
      totalPenalties: true,
    },
    orderBy: { round: "asc" },
  });

  const chartData = roundStats.map((rs) => ({
    round: rs.round,
    avgPoints: Math.round(rs._avg.totalPoints || 0),
    avgTries: Math.round((rs._avg.totalTries || 0) * 10) / 10,
    totalPenalties: rs._sum.totalPenalties || 0,
    avgEffectiveTime: Math.round((rs._avg.effectiveTimeSeconds || 0) / 60),
  }));

  const avgEffectiveTime = matchAggregates._avg.effectiveTimeSeconds || 0;
  const avgEffectiveMinutes = Math.floor(avgEffectiveTime / 60);
  const avgEffectiveSecs = Math.floor(avgEffectiveTime % 60);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Campeonato Português
        </h1>
        <RoundFilter rounds={availableRounds} selectedRound={selectedRound} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <StatCard
          title="Jogos"
          value={matchCount}
          subtitle={selectedRound ? `Jornada ${selectedRound}` : "Total"}
        />
        <StatCard
          title="Pontos Totais"
          value={matchAggregates._sum.totalPoints || 0}
          subtitle={`${Math.round((matchAggregates._sum.totalPoints || 0) / Math.max(matchCount, 1))} por jogo`}
        />
        <StatCard
          title="Ensaios"
          value={matchAggregates._sum.totalTries || 0}
          subtitle={`${((matchAggregates._sum.totalTries || 0) / Math.max(matchCount, 1)).toFixed(1)} por jogo`}
        />
        <StatCard
          title="Tempo Útil Médio"
          value={`${avgEffectiveMinutes}:${avgEffectiveSecs.toString().padStart(2, "0")}`}
          subtitle="minutos por jogo"
        />
      </div>

      {/* Group Classifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grupo A</CardTitle>
          </CardHeader>
          <CardContent>
            <LeagueTable data={groupA} compact />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grupo B</CardTitle>
          </CardHeader>
          <CardContent>
            <LeagueTable data={groupB} compact />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grupo C</CardTitle>
          </CardHeader>
          <CardContent>
            <LeagueTable data={groupC} compact />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <LeagueCharts data={chartData} />
    </div>
  );
}
