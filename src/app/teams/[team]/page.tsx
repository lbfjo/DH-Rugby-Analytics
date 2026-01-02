import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TeamCharts } from "./TeamCharts";
import Link from "next/link";

interface Props {
  params: Promise<{ team: string }>;
}

export default async function TeamDetailPage({ params }: Props) {
  const { team: teamSlug } = await params;
  const teamName = decodeURIComponent(teamSlug);

  const team = await prisma.team.findFirst({
    where: { name: teamName },
    include: {
      roundStats: {
        orderBy: { round: "asc" },
      },
      matchStats: {
        include: {
          match: {
            include: {
              team1: true,
              team2: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    notFound();
  }

  // Calculate aggregated stats
  const totalStats = team.roundStats.reduce(
    (acc, rs) => ({
      matchPoints: acc.matchPoints + rs.matchPoints,
      pointsScored: acc.pointsScored + rs.pointsScored,
      pointsConceded: acc.pointsConceded + rs.pointsConceded,
      triesScored: acc.triesScored + rs.triesScored,
      triesConceded: acc.triesConceded + rs.triesConceded,
      tacklesMade: acc.tacklesMade + rs.tacklesMade,
      tacklesMissed: acc.tacklesMissed + rs.tacklesMissed,
      penaltiesConceded: acc.penaltiesConceded + rs.penaltiesConceded,
      lineBreaks: acc.lineBreaks + rs.lineBreaks,
      totalRucks: acc.totalRucks + rs.totalRucks,
    }),
    {
      matchPoints: 0,
      pointsScored: 0,
      pointsConceded: 0,
      triesScored: 0,
      triesConceded: 0,
      tacklesMade: 0,
      tacklesMissed: 0,
      penaltiesConceded: 0,
      lineBreaks: 0,
      totalRucks: 0,
    }
  );

  const gamesPlayed = team.roundStats.length;

  // Calculate averages
  const avgStats = {
    ruckSuccess:
      team.roundStats.reduce((acc, rs) => acc + rs.ruckSuccess, 0) / gamesPlayed,
    tackleSuccess:
      team.roundStats.reduce((acc, rs) => acc + rs.tackleSuccessRate, 0) / gamesPlayed,
    possession:
      team.roundStats.reduce((acc, rs) => acc + rs.possessionPercent, 0) / gamesPlayed,
    scrumsWon:
      team.roundStats.reduce((acc, rs) => acc + rs.scrumsWon, 0) / gamesPlayed,
    lineoutsWon:
      team.roundStats.reduce((acc, rs) => acc + rs.lineoutsWon, 0) / gamesPlayed,
  };

  // Calculate 4 pillars scores (0-100)
  const pillars = [
    {
      pillar: "Ataque",
      value: Math.min(
        100,
        ((totalStats.pointsScored / gamesPlayed / 40) * 50 +
          (totalStats.triesScored / gamesPlayed / 5) * 30 +
          (totalStats.lineBreaks / gamesPlayed / 5) * 20)
      ),
      fullMark: 100,
    },
    {
      pillar: "Defesa",
      value: Math.min(
        100,
        avgStats.tackleSuccess * 60 +
          (1 - totalStats.pointsConceded / gamesPlayed / 50) * 40
      ),
      fullMark: 100,
    },
    {
      pillar: "Disciplina",
      value: Math.min(
        100,
        Math.max(0, 100 - (totalStats.penaltiesConceded / gamesPlayed) * 5)
      ),
      fullMark: 100,
    },
    {
      pillar: "Set-Piece",
      value: Math.min(100, (avgStats.scrumsWon * 50 + avgStats.lineoutsWon * 50)),
      fullMark: 100,
    },
  ];

  // Prepare trend data
  const trendData = team.roundStats.map((rs) => ({
    round: rs.round,
    pointsScored: rs.pointsScored,
    pointsConceded: rs.pointsConceded,
    tries: rs.triesScored,
    ruckSuccess: Math.round(rs.ruckSuccess * 100),
    tackleSuccess: Math.round(rs.tackleSuccessRate * 100),
    penalties: rs.penaltiesConceded,
  }));

  // Penalties breakdown
  const penaltiesData = team.roundStats.map((rs) => ({
    name: `J${rs.round}`,
    ruckDefensivo: rs.penDefensiveRuck,
    ruckAtacante: rs.penAttackingRuck,
    foraDeJogo: rs.penOffside,
    placagem: rs.penTackle,
    alMaul: rs.penLineoutMaul,
    scrum: rs.penScrum,
    outras: rs.penOther,
  }));

  // Recent matches
  const recentMatches = team.matchStats
    .map((ms) => {
      const match = ms.match;
      const isTeam1 = match.team1Id === team.id;
      const opponent = isTeam1 ? match.team2.name : match.team1.name;
      const teamPoints = isTeam1 ? match.pointsTeam1 : match.pointsTeam2;
      const opponentPoints = isTeam1 ? match.pointsTeam2 : match.pointsTeam1;
      const result =
        teamPoints > opponentPoints ? "W" : teamPoints < opponentPoints ? "L" : "D";

      return {
        id: match.id,
        round: match.round,
        opponent,
        teamPoints,
        opponentPoints,
        result,
        isHome: isTeam1,
      };
    })
    .sort((a, b) => b.round - a.round);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/teams"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm md:text-base"
        >
          &larr; Equipas
        </Link>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
        <StatCard title="Pts. Class." value={totalStats.matchPoints} />
        <StatCard title="Jogos" value={gamesPlayed} />
        <StatCard title="Pontos M/S" value={`${totalStats.pointsScored}/${totalStats.pointsConceded}`} />
        <StatCard
          title="Diferença"
          value={
            (totalStats.pointsScored - totalStats.pointsConceded > 0 ? "+" : "") +
            (totalStats.pointsScored - totalStats.pointsConceded)
          }
        />
        <StatCard title="Ensaios M/S" value={`${totalStats.triesScored}/${totalStats.triesConceded}`} />
        <StatCard title="Penalidades" value={totalStats.penaltiesConceded} />
      </div>

      {/* Charts */}
      <TeamCharts
        teamName={team.name}
        pillars={pillars}
        trendData={trendData}
        penaltiesData={penaltiesData}
        avgStats={avgStats}
      />

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Jogos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentMatches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm ${
                      match.result === "W"
                        ? "bg-green-500"
                        : match.result === "L"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {match.result}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {match.isHome ? "vs" : "@"} {match.opponent}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">Jornada {match.round}</p>
                  </div>
                </div>
                <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  {match.teamPoints} - {match.opponentPoints}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
