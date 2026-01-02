"use client";

import { ComparisonBar } from "@/components/charts/ComparisonBar";

interface ComparisonData {
  stat: string;
  team1: number;
  team2: number;
}

interface MatchComparisonProps {
  data: ComparisonData[];
  team1Name: string;
  team2Name: string;
}

export function MatchComparison({ data, team1Name, team2Name }: MatchComparisonProps) {
  return (
    <ComparisonBar
      data={data}
      team1Name={team1Name}
      team2Name={team2Name}
    />
  );
}
