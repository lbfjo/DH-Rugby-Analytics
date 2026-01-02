"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HeadToHeadView } from "./HeadToHeadView";

interface Team {
  id: string;
  name: string;
  groupName: string;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  group: string;
  gamesPlayed: number;
  avg: {
    pointsScored: number;
    pointsConceded: number;
    triesScored: number;
    triesConceded: number;
    possession: number;
    tackleSuccess: number;
    lineoutSuccess: number;
    scrumSuccess: number;
    ruckSuccess: number;
    penalties: number;
    lineBreaks: number;
    kicks: number;
  };
  sources: {
    lineout: number;
    scrum: number;
    turnover: number;
    counter: number;
    tap: number;
    penalty: number;
  };
}

interface Props {
  teams: Team[];
  stats: TeamStats[];
}

export function AnalyticsDashboard({ teams, stats }: Props) {
  const [team1Id, setTeam1Id] = useState<string>(teams[0]?.id || "");
  const [team2Id, setTeam2Id] = useState<string>(teams[1]?.id || "");

  const team1Stats = stats.find((s) => s.teamId === team1Id);
  const team2Stats = stats.find((s) => s.teamId === team2Id);

  return (
    <div className="space-y-6">
      {/* Team Selectors */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Team 1 Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team A
              </label>
              <select
                value={team1Id}
                onChange={(e) => setTeam1Id(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-2.5 border"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="hidden md:flex justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-gray-500 dark:text-gray-400">
                VS
              </span>
            </div>

            {/* Team 2 Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team B
              </label>
              <select
                value={team2Id}
                onChange={(e) => setTeam2Id(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 sm:text-sm p-2.5 border"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Head to Head View */}
      {team1Stats && team2Stats ? (
        <HeadToHeadView team1={team1Stats} team2={team2Stats} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select two teams to see the comparison.
        </div>
      )}
    </div>
  );
}
