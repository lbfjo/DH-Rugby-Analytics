import { prisma } from "@/lib/db";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
  });

  const teamStats = await prisma.teamRoundStats.groupBy({
    by: ["teamId"],
    _avg: {
      pointsScored: true,
      pointsConceded: true,
      triesScored: true,
      triesConceded: true,
      possessionPercent: true,
      tackleSuccessRate: true,
      lineoutsWon: true,
      scrumsWon: true,
      ruckSuccess: true,
      penaltiesConceded: true,
      lineBreaks: true,
      kickingGame: true,
      effectiveTimeSeconds: true,
    },
    _sum: {
      penaltiesConceded: true,
      triesFromLineout: true,
      triesFromScrum: true,
      triesFromTurnover: true,
      triesFromCounterAttack: true,
      triesFromTap: true,
      triesFromPenaltyScrum: true,
    },
    _count: {
      round: true,
    },
  });

  // Map stats to a more usable format, merging with team names
  const formattedStats = teamStats.map((stat) => {
    const team = teams.find((t) => t.id === stat.teamId);
    return {
      teamId: stat.teamId,
      teamName: team?.name || "Unknown",
      group: team?.groupName || "A",
      gamesPlayed: stat._count.round,
      avg: {
        pointsScored: stat._avg.pointsScored || 0,
        pointsConceded: stat._avg.pointsConceded || 0,
        triesScored: stat._avg.triesScored || 0,
        triesConceded: stat._avg.triesConceded || 0,
        possession: (stat._avg.possessionPercent || 0) * 100,
        tackleSuccess: (stat._avg.tackleSuccessRate || 0) * 100,
        lineoutSuccess: (stat._avg.lineoutsWon || 0) * 100,
        scrumSuccess: (stat._avg.scrumsWon || 0) * 100,
        ruckSuccess: (stat._avg.ruckSuccess || 0) * 100,
        penalties: stat._avg.penaltiesConceded || 0,
        lineBreaks: stat._avg.lineBreaks || 0,
        kicks: stat._avg.kickingGame || 0,
      },
      sources: {
        lineout: stat._sum.triesFromLineout || 0,
        scrum: stat._sum.triesFromScrum || 0,
        turnover: stat._sum.triesFromTurnover || 0,
        counter: stat._sum.triesFromCounterAttack || 0,
        tap: stat._sum.triesFromTap || 0,
        penalty: stat._sum.triesFromPenaltyScrum || 0,
      }
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Deep Dive Analytics
      </h1>
      <AnalyticsDashboard teams={teams} stats={formattedStats} />
    </div>
  );
}
