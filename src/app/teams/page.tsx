import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    include: {
      roundStats: {
        orderBy: { round: "desc" },
        take: 1,
      },
      _count: {
        select: {
          matchesAsTeam1: true,
          matchesAsTeam2: true,
        },
      },
    },
  });

  // Get aggregated stats for each team
  const teamStats = await prisma.teamRoundStats.groupBy({
    by: ["teamId"],
    _sum: {
      matchPoints: true,
      pointsScored: true,
      pointsConceded: true,
      triesScored: true,
    },
    _avg: {
      ruckSuccess: true,
      tackleSuccessRate: true,
      possessionPercent: true,
    },
    _count: {
      round: true,
    },
  });

  const statsMap = new Map(teamStats.map((ts) => [ts.teamId, ts]));

  const teamsWithStats = teams
    .map((team) => {
      const stats = statsMap.get(team.id);
      return {
        ...team,
        matchesPlayed: stats?._count.round || 0,
        totalPoints: stats?._sum.matchPoints || 0,
        pointsFor: stats?._sum.pointsScored || 0,
        pointsAgainst: stats?._sum.pointsConceded || 0,
        triesScored: stats?._sum.triesScored || 0,
        avgRuckSuccess: stats?._avg.ruckSuccess || 0,
        avgTackleSuccess: stats?._avg.tackleSuccessRate || 0,
        avgPossession: stats?._avg.possessionPercent || 0,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Equipas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {teamsWithStats.map((team) => (
          <Link key={team.id} href={`/teams/${encodeURIComponent(team.name)}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <h2 className="text-base md:text-xl font-bold text-gray-900 dark:text-white">
                  {team.name}
                </h2>
                <span className="text-lg md:text-2xl font-bold text-green-600">
                  {team.totalPoints} pts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Jogos</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {team.matchesPlayed}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Ensaios</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {team.triesScored}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Pontos M/S</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {team.pointsFor}/{team.pointsAgainst}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Diferença</p>
                  <p
                    className={`font-medium ${
                      team.pointsFor - team.pointsAgainst > 0
                        ? "text-green-600"
                        : team.pointsFor - team.pointsAgainst < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {team.pointsFor - team.pointsAgainst > 0 ? "+" : ""}
                    {team.pointsFor - team.pointsAgainst}
                  </p>
                </div>
              </div>

              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                  <span>Ruck: {(team.avgRuckSuccess * 100).toFixed(0)}%</span>
                  <span>Placagem: {(team.avgTackleSuccess * 100).toFixed(0)}%</span>
                  <span>Posse: {(team.avgPossession * 100).toFixed(0)}%</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
