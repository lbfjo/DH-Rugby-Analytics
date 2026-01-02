import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RoundFilter } from "./RoundFilter";

interface Props {
  searchParams: Promise<{ round?: string }>;
}

export default async function MatchesPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedRound = params.round ? parseInt(params.round) : undefined;

  // Get available rounds
  const rounds = await prisma.match.findMany({
    select: { round: true },
    distinct: ["round"],
    orderBy: { round: "asc" },
  });
  const availableRounds = rounds.map((r) => r.round);

  // Get matches
  const matches = await prisma.match.findMany({
    where: selectedRound ? { round: selectedRound } : undefined,
    include: {
      team1: true,
      team2: true,
    },
    orderBy: [{ round: "desc" }, { createdAt: "desc" }],
  });

  // Group by round
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, typeof matches>);

  const roundNumbers = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Jogos</h1>
        <RoundFilter rounds={availableRounds} selectedRound={selectedRound} />
      </div>

      {roundNumbers.map((round) => (
        <div key={round}>
          <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
            Jornada {round}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {matchesByRound[round].map((match) => {
              const team1Won = match.pointsTeam1 > match.pointsTeam2;
              const team2Won = match.pointsTeam2 > match.pointsTeam1;

              return (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm md:text-base truncate ${
                            team1Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.team1.name}
                        </p>
                        <p
                          className={`font-medium text-sm md:text-base truncate ${
                            team2Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.team2.name}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p
                          className={`text-lg md:text-xl font-bold ${
                            team1Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.pointsTeam1}
                        </p>
                        <p
                          className={`text-lg md:text-xl font-bold ${
                            team2Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.pointsTeam2}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                      <span>Ensaios: {match.totalTries}</span>
                      <span>Pen: {match.totalPenalties}</span>
                      {match.referee && <span className="hidden sm:inline">Árbitro: {match.referee}</span>}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
