import Link from "next/link";

interface LeagueTableData {
  teamId: string;
  teamName: string;
  played: number;
  points: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  triesFor: number;
  triesAgainst: number;
}

interface LeagueTableProps {
  data: LeagueTableData[];
  compact?: boolean;
}

export function LeagueTable({ data, compact = false }: LeagueTableProps) {
  if (compact) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                #
              </th>
              <th className="text-left py-2 px-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Equipa
              </th>
              <th className="text-center py-2 px-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                J
              </th>
              <th className="text-center py-2 px-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Pts
              </th>
              <th className="text-center py-2 px-1 font-medium text-gray-500 dark:text-gray-400 text-xs">
                Dif
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.teamId}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-2 px-1 font-medium text-gray-900 dark:text-white text-xs">
                  {index + 1}
                </td>
                <td className="py-2 px-1">
                  <Link
                    href={`/teams/${encodeURIComponent(row.teamName)}`}
                    className="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 font-medium text-xs"
                  >
                    {row.teamName}
                  </Link>
                </td>
                <td className="py-2 px-1 text-center text-gray-600 dark:text-gray-400 text-xs">
                  {row.played}
                </td>
                <td className="py-2 px-1 text-center font-bold text-gray-900 dark:text-white text-xs">
                  {row.points}
                </td>
                <td
                  className={`py-2 px-1 text-center font-medium text-xs ${
                    row.pointsDiff > 0
                      ? "text-green-600"
                      : row.pointsDiff < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {row.pointsDiff > 0 ? "+" : ""}
                  {row.pointsDiff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              Pos
            </th>
            <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              Equipa
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              J
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              Pts
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              PM
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              PS
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              Dif
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              EM
            </th>
            <th className="text-center py-3 px-2 font-medium text-gray-500 dark:text-gray-400">
              ES
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.teamId}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                {index + 1}
              </td>
              <td className="py-3 px-2">
                <Link
                  href={`/teams/${encodeURIComponent(row.teamName)}`}
                  className="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 font-medium"
                >
                  {row.teamName}
                </Link>
              </td>
              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                {row.played}
              </td>
              <td className="py-3 px-2 text-center font-bold text-gray-900 dark:text-white">
                {row.points}
              </td>
              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                {row.pointsFor}
              </td>
              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                {row.pointsAgainst}
              </td>
              <td
                className={`py-3 px-2 text-center font-medium ${
                  row.pointsDiff > 0
                    ? "text-green-600"
                    : row.pointsDiff < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {row.pointsDiff > 0 ? "+" : ""}
                {row.pointsDiff}
              </td>
              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                {row.triesFor}
              </td>
              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                {row.triesAgainst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
