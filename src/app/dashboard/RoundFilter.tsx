"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface RoundFilterProps {
  rounds: number[];
  selectedRound?: number;
}

export function RoundFilter({ rounds, selectedRound }: RoundFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("round");
    } else {
      params.set("round", value);
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <select
      value={selectedRound || "all"}
      onChange={handleChange}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="all">Todas as Jornadas</option>
      {rounds.map((round) => (
        <option key={round} value={round}>
          Jornada {round}
        </option>
      ))}
    </select>
  );
}
