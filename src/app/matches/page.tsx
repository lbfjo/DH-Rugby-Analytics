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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jogos</h1>
        <RoundFilter rounds={availableRounds} selectedRound={selectedRound} />
      </div>

      {roundNumbers.map((round) => (
        <div key={round}>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Jornada {round}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchesByRound[round].map((match) => {
              const team1Won = match.pointsTeam1 > match.pointsTeam2;
              const team2Won = match.pointsTeam2 > match.pointsTeam1;

              return (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            team1Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.team1.name}
                        </p>
                        <p
                          className={`font-medium ${
                            team2Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.team2.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            team1Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.pointsTeam1}
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            team2Won
                              ? "text-green-600 dark:text-green-500"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {match.pointsTeam2}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Ensaios: {match.totalTries}</span>
                      <span>Penalidades: {match.totalPenalties}</span>
                      {match.referee && <span>Árbitro: {match.referee}</span>}
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
