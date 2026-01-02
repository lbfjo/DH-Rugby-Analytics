import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import { z } from "zod";

const prisma = new PrismaClient();

// Helper to parse time strings like "00:28:06" to seconds
function parseTimeToSeconds(value: unknown): number {
  if (value === null || value === undefined) return 0;

  // Handle Date objects (Excel time values)
  if (value instanceof Date) {
    const hours = value.getHours();
    const minutes = value.getMinutes();
    const seconds = value.getSeconds();

    // Calculate total hours including days (relative to Excel epoch 1899-12-30)
    // We assume the date is in 1899/1900 range as it comes from a time-only or duration cell.
    const day = value.getDate();
    const month = value.getMonth(); // 0-11
    const year = value.getFullYear();
    
    // Simple day offset calculation for the relevant range (Dec 1899 - Jan 1900)
    let daysOffset = 0;
    if (year === 1899 && month === 11) {
      daysOffset = day - 30;
    } else if (year === 1900 && month === 0) {
      daysOffset = (31 - 30) + day;
    } else {
        daysOffset = 0;
    }
    
    const totalHours = daysOffset * 24 + hours;

    // Heuristic: If totalHours > 2, it's likely the "Hours as Minutes" Excel bug 
    // (e.g. 27:41 parsed as 27:41:00 -> 27 hours).
    if (totalHours > 2) {
       return totalHours * 60 + minutes;
    }
    
    // Otherwise standard hh:mm:ss
    return totalHours * 3600 + minutes * 60 + seconds;
  }

  // Handle string format "HH:MM:SS" or "MM:SS"
  if (typeof value === "string") {
    const parts = value.split(":").map(Number);
    if (parts.length === 3) {
      // HH:MM:SS - interpret as MM:SS (ignore first part or treat as minutes)
      return parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
  }

  // Handle number (might be Excel serial date)
  if (typeof value === "number") {
    if (value < 1) {
      const totalSeconds = value * 24 * 60 * 60;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      return minutes * 60 + seconds;
    }
    return Math.floor(value);
  }

  return 0;
}

// Parse possession time (stored as HH:MM where HH=minutes, MM=seconds)
function parsePossessionToSeconds(value: unknown): number {
  if (value === null || value === undefined) return 0;

  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes();
  }

  if (typeof value === "string") {
    const parts = value.split(":").map(Number);
    if (parts.length >= 2) {
      return parts[0] * 60 + parts[1];
    }
  }

  if (typeof value === "number" && value < 1) {
    return Math.floor(value * 24 * 60 * 60);
  }

  return 0;
}

// Safe number parser
function safeNumber(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined || value === "") return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// Safe float parser for percentages (already 0-1 in Excel)
function safeFloat(value: unknown, defaultValue = 0): number {
  if (value === null || value === undefined || value === "") return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// Calculate league points based on match result
function calculateLeaguePoints(myPoints: number, opponentPoints: number, myTries: number): number {
  let points = 0;

  // Result points
  if (myPoints > opponentPoints) {
    points += 4; // Win
  } else if (myPoints === opponentPoints) {
    points += 2; // Draw
  }
  // Loss = 0

  // Offensive Bonus (4+ tries)
  if (myTries >= 4) {
    points += 1;
  }

  // Defensive Bonus (Loss by <= 7)
  if (myPoints < opponentPoints && (opponentPoints - myPoints) <= 7) {
    points += 1;
  }

  return points;
}

// Zod schemas for validation
const InfoJogoRowSchema = z.object({
  equipa1: z.string().min(1),
  equipa2: z.string().min(1),
  round: z.number().int().positive(),
  referee: z.string().nullable(),
  pointsTeam1: z.number().int().nonnegative(),
  pointsTeam2: z.number().int().nonnegative(),
  totalPoints: z.number().int().nonnegative(),
  triesTeam1: z.number().int().nonnegative(),
  triesTeam2: z.number().int().nonnegative(),
  totalTries: z.number().int().nonnegative(),
  triesFromLineout: z.number().int().nonnegative(),
  triesFromScrum: z.number().int().nonnegative(),
  effectiveTimeSeconds: z.number().int().nonnegative(),
  kickingGame: z.number().int().nonnegative(),
  totalRucks: z.number().int().nonnegative(),
  ruckSuccessTeam1: z.number().min(0).max(1),
  ruckSuccessTeam2: z.number().min(0).max(1),
  totalScrums: z.number().int().nonnegative(),
  scrumsTeam1: z.number().int().nonnegative(),
  scrumsTeam2: z.number().int().nonnegative(),
  totalLineouts: z.number().int().nonnegative(),
  lineoutsTeam1: z.number().int().nonnegative(),
  lineoutsTeam2: z.number().int().nonnegative(),
  totalPenalties: z.number().int().nonnegative(),
  penaltiesTeam1: z.number().int().nonnegative(),
  penaltiesTeam2: z.number().int().nonnegative(),
  penaltiesDefensiveRuck: z.number().int().nonnegative(),
  penaltiesAttackingRuck: z.number().int().nonnegative(),
  penaltiesOffside: z.number().int().nonnegative(),
  penaltiesTackle: z.number().int().nonnegative(),
});

const InfoClubesRowSchema = z.object({
  equipa: z.string().min(1),
  round: z.number().int().positive(),
  pointsScored: z.number().int().nonnegative(),
  pointsConceded: z.number().int().nonnegative(),
  matchPoints: z.number().int().nonnegative(),
  triesScored: z.number().int().nonnegative(),
  triesConceded: z.number().int().nonnegative(),
  triesMatch: z.number().int().nonnegative(),
  triesFromLineout: z.number().int().nonnegative(),
  triesFromScrum: z.number().int().nonnegative(),
  triesFromTurnover: z.number().int().nonnegative(),
  triesFromCounterAttack: z.number().int().nonnegative(),
  triesFromTap: z.number().int().nonnegative(),
  triesFromPenaltyScrum: z.number().int().nonnegative(),
  effectiveTimeSeconds: z.number().int().nonnegative(),
  possessionSeconds: z.number().int().nonnegative(),
  possessionPercent: z.number().min(0).max(1),
  kickingGame: z.number().int().nonnegative(),
  tacklesMade: z.number().int().nonnegative(),
  tacklesMissed: z.number().int().nonnegative(),
  tackleSuccessRate: z.number().min(0).max(1),
  lineBreaks: z.number().int().nonnegative(),
  totalRucks: z.number().int().nonnegative(),
  ruckSuccess: z.number().min(0).max(1),
  totalScrums: z.number().int().nonnegative(),
  scrumsWon: z.number().min(0).max(1),
  scrumsReset: z.number().int().nonnegative(),
  totalLineouts: z.number().int().nonnegative(),
  lineoutsWon: z.number().min(0).max(1),
  penaltiesConceded: z.number().int().nonnegative(),
  penDefensiveRuck: z.number().int().nonnegative(),
  penAttackingRuck: z.number().int().nonnegative(),
  penOffside: z.number().int().nonnegative(),
  penTackle: z.number().int().nonnegative(),
  penLineoutMaul: z.number().int().nonnegative(),
  penScrum: z.number().int().nonnegative(),
  penOther: z.number().int().nonnegative(),
});

export async function ingestExcelData(excelPath: string) {
  console.log(`Reading Excel from: ${excelPath}`);

  // For buffer or file path input, XLSX.readFile handles paths. 
  // If we wanted to handle buffers directly, we'd use XLSX.read.
  // Here we assume a file path is provided (temp file from upload).
  const workbook = XLSX.readFile(excelPath, { cellDates: true });

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.matchTeamStats.deleteMany();
  await prisma.teamRoundStats.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  // Process Info Clubes to get all teams
  const clubesSheet = workbook.Sheets["Info Clubes"];
  const clubesData = XLSX.utils.sheet_to_json(clubesSheet, { header: 1 }) as unknown[][];

  // Find header row (row with "Equipa")
  let clubesHeaderIndex = 0;
  for (let i = 0; i < clubesData.length; i++) {
    if (clubesData[i][0] === "Equipa") {
      clubesHeaderIndex = i;
      break;
    }
  }

  const clubesHeaders = clubesData[clubesHeaderIndex] as string[];
  const clubesRows = clubesData.slice(clubesHeaderIndex + 1);

  // Get unique teams
  const teamNames = new Set<string>();
  for (const row of clubesRows) {
    const equipa = row[0];
    if (typeof equipa === "string" && equipa && !["TOTAIS", "MÉDIA", "TOTAL"].includes(equipa)) {
      teamNames.add(equipa);
    }
  }

  console.log(`Found ${teamNames.size} teams: ${Array.from(teamNames).join(", ")}`);

  // Group mapping based on championship structure
  const teamGroups: Record<string, string> = {
    // Group A
    "Belenenses": "A",
    "Benfica": "A",
    "Agronomia": "A",
    "Santarém": "A",
    // Group B
    "Cascais": "B",
    "CDUL": "B",
    "CDUP": "B",
    "Montemor": "B",
    // Group C
    "Direito": "C",
    "São Miguel": "C",
    "Técnico": "C",
    "Académica": "C",
  };

  // Create teams
  const teamMap = new Map<string, string>();
  for (const name of teamNames) {
    const groupName = teamGroups[name] || "A";
    const team = await prisma.team.create({ data: { name, groupName } });
    teamMap.set(name, team.id);
    console.log(`Created team: ${name} (Group ${groupName}, ${team.id})`);
  }

  // Process Info Clubes (team round stats)
  console.log("\nProcessing Info Clubes...");
  let clubesProcessed = 0;
  let clubesSkipped = 0;

  for (const row of clubesRows) {
    const equipa = row[0];

    // Skip invalid rows
    if (!equipa || typeof equipa !== "string" || ["TOTAIS", "MÉDIA", "TOTAL"].includes(equipa)) {
      clubesSkipped++;
      continue;
    }

    const round = safeNumber(row[1]);
    if (round === 0) {
      clubesSkipped++;
      continue;
    }

    // Check if we have actual data (not just empty row for future round)
    const pointsScored = safeNumber(row[2]);
    const pointsConceded = safeNumber(row[3]);
    if (pointsScored === 0 && pointsConceded === 0 && safeNumber(row[4]) === 0) {
      // Likely empty future round
      clubesSkipped++;
      continue;
    }

    const teamId = teamMap.get(equipa);
    if (!teamId) {
      console.warn(`Team not found: ${equipa}`);
      clubesSkipped++;
      continue;
    }

    const rawData = {
      equipa,
      round,
      pointsScored,
      pointsConceded,
      matchPoints: safeNumber(row[4]),
      triesScored: safeNumber(row[5]),
      triesConceded: safeNumber(row[6]),
      triesMatch: safeNumber(row[7]),
      triesFromLineout: safeNumber(row[8]),
      triesFromScrum: safeNumber(row[9]),
      triesFromTurnover: safeNumber(row[10]),
      triesFromCounterAttack: safeNumber(row[11]),
      triesFromTap: safeNumber(row[12]),
      triesFromPenaltyScrum: safeNumber(row[13]),
      effectiveTimeSeconds: parseTimeToSeconds(row[14]),
      possessionSeconds: parsePossessionToSeconds(row[15]),
      possessionPercent: safeFloat(row[16]),
      kickingGame: safeNumber(row[17]),
      tacklesMade: safeNumber(row[18]),
      tacklesMissed: safeNumber(row[19]),
      tackleSuccessRate: safeFloat(row[20]),
      lineBreaks: safeNumber(row[21]),
      totalRucks: safeNumber(row[22]),
      ruckSuccess: safeFloat(row[23]),
      totalScrums: safeNumber(row[24]),
      scrumsWon: safeFloat(row[25]),
      scrumsReset: safeNumber(row[26]),
      totalLineouts: safeNumber(row[27]),
      lineoutsWon: safeFloat(row[28]),
      penaltiesConceded: safeNumber(row[29]),
      penDefensiveRuck: safeNumber(row[30]),
      penAttackingRuck: safeNumber(row[31]),
      penOffside: safeNumber(row[32]),
      penTackle: safeNumber(row[33]),
      penLineoutMaul: safeNumber(row[34]),
      penScrum: safeNumber(row[35]),
      penOther: safeNumber(row[36]),
    };

    const validation = InfoClubesRowSchema.safeParse(rawData);
    if (!validation.success) {
      console.warn(`Validation failed for ${equipa} round ${round}:`, validation.error.errors);
      clubesSkipped++;
      continue;
    }

    await prisma.teamRoundStats.create({
      data: {
        teamId,
        round: rawData.round,
        pointsScored: rawData.pointsScored,
        pointsConceded: rawData.pointsConceded,
        matchPoints: 0, // Calculated later from match results. row[4] is "Pontos Jogo" (Total Points), not League Points.
        triesScored: rawData.triesScored,
        triesConceded: rawData.triesConceded,
        triesMatch: rawData.triesMatch,
        triesFromLineout: rawData.triesFromLineout,
        triesFromScrum: rawData.triesFromScrum,
        triesFromTurnover: rawData.triesFromTurnover,
        triesFromCounterAttack: rawData.triesFromCounterAttack,
        triesFromTap: rawData.triesFromTap,
        triesFromPenaltyScrum: rawData.triesFromPenaltyScrum,
        effectiveTimeSeconds: rawData.effectiveTimeSeconds,
        possessionSeconds: rawData.possessionSeconds,
        possessionPercent: rawData.possessionPercent,
        kickingGame: rawData.kickingGame,
        tacklesMade: rawData.tacklesMade,
        tacklesMissed: rawData.tacklesMissed,
        tackleSuccessRate: rawData.tackleSuccessRate,
        lineBreaks: rawData.lineBreaks,
        totalRucks: rawData.totalRucks,
        ruckSuccess: rawData.ruckSuccess,
        totalScrums: rawData.totalScrums,
        scrumsWon: rawData.scrumsWon,
        scrumsReset: rawData.scrumsReset,
        totalLineouts: rawData.totalLineouts,
        lineoutsWon: rawData.lineoutsWon,
        penaltiesConceded: rawData.penaltiesConceded,
        penDefensiveRuck: rawData.penDefensiveRuck,
        penAttackingRuck: rawData.penAttackingRuck,
        penOffside: rawData.penOffside,
        penTackle: rawData.penTackle,
        penLineoutMaul: rawData.penLineoutMaul,
        penScrum: rawData.penScrum,
        penOther: rawData.penOther,
        rawRowJson: JSON.stringify(row),
      },
    });

    clubesProcessed++;
  }

  console.log(`Info Clubes: ${clubesProcessed} processed, ${clubesSkipped} skipped`);

  // Process Info Jogo (matches)
  console.log("\nProcessing Info Jogo...");
  const jogoSheet = workbook.Sheets["Info Jogo"];
  const jogoData = XLSX.utils.sheet_to_json(jogoSheet, { header: 1 }) as unknown[][];

  // Find header row
  let jogoHeaderIndex = 0;
  for (let i = 0; i < jogoData.length; i++) {
    if (jogoData[i][0] === "Equipa 1") {
      jogoHeaderIndex = i;
      break;
    }
  }

  const jogoRows = jogoData.slice(jogoHeaderIndex + 1);
  let matchesProcessed = 0;
  let matchesSkipped = 0;

  for (const row of jogoRows) {
    const equipa1 = row[0];
    const equipa2 = row[1];

    // Skip invalid rows (TOTAIS, MÉDIA, empty)
    if (!equipa1 || typeof equipa1 !== "string" || ["TOTAIS", "MÉDIA", "TOTAL"].includes(equipa1)) {
      matchesSkipped++;
      continue;
    }

    if (!equipa2 || typeof equipa2 !== "string") {
      matchesSkipped++;
      continue;
    }

    const team1Id = teamMap.get(equipa1);
    const team2Id = teamMap.get(equipa2);

    if (!team1Id || !team2Id) {
      console.warn(`Teams not found: ${equipa1} vs ${equipa2}`);
      matchesSkipped++;
      continue;
    }

    // Parse effective time
    const effectiveTimeSeconds = parseTimeToSeconds(row[12]);

    const rawData = {
      equipa1,
      equipa2,
      round: safeNumber(row[2]),
      referee: row[3] ? String(row[3]) : null,
      pointsTeam1: safeNumber(row[4]),
      pointsTeam2: safeNumber(row[5]),
      totalPoints: safeNumber(row[6]),
      triesTeam1: safeNumber(row[7]),
      triesTeam2: safeNumber(row[8]),
      totalTries: safeNumber(row[9]),
      triesFromLineout: safeNumber(row[10]),
      triesFromScrum: safeNumber(row[11]),
      effectiveTimeSeconds,
      kickingGame: safeNumber(row[13]),
      totalRucks: safeNumber(row[14]),
      ruckSuccessTeam1: safeFloat(row[15]),
      ruckSuccessTeam2: safeFloat(row[16]),
      totalScrums: safeNumber(row[17]),
      scrumsTeam1: safeNumber(row[18]),
      scrumsTeam2: safeNumber(row[19]),
      totalLineouts: safeNumber(row[20]),
      lineoutsTeam1: safeNumber(row[21]),
      lineoutsTeam2: safeNumber(row[22]),
      totalPenalties: safeNumber(row[23]),
      penaltiesTeam1: safeNumber(row[24]),
      penaltiesTeam2: safeNumber(row[25]),
      penaltiesDefensiveRuck: safeNumber(row[26]),
      penaltiesAttackingRuck: safeNumber(row[27]),
      penaltiesOffside: safeNumber(row[28]),
      penaltiesTackle: safeNumber(row[29]),
    };

    // DATA PATCH: Fix swapped scores for Montemor vs Cascais (Round 1)
    if (rawData.equipa1 === "Montemor" && rawData.equipa2 === "Cascais" && rawData.pointsTeam1 === 110 && rawData.pointsTeam2 === 0) {
      console.warn("Applying Data Patch: Swapping scores for Montemor vs Cascais (Round 1)");
      const tempPoints = rawData.pointsTeam1;
      rawData.pointsTeam1 = rawData.pointsTeam2;
      rawData.pointsTeam2 = tempPoints;

      const tempTries = rawData.triesTeam1;
      rawData.triesTeam1 = rawData.triesTeam2;
      rawData.triesTeam2 = tempTries;
    }

    const validation = InfoJogoRowSchema.safeParse(rawData);
    if (!validation.success) {
      console.warn(`Match validation failed for ${equipa1} vs ${equipa2}:`, JSON.stringify(validation.error.errors, null, 2));
      matchesSkipped++;
      continue;
    }

    const match = await prisma.match.create({
      data: {
        team1Id,
        team2Id,
        round: rawData.round,
        referee: rawData.referee,
        pointsTeam1: rawData.pointsTeam1,
        pointsTeam2: rawData.pointsTeam2,
        totalPoints: rawData.totalPoints,
        triesTeam1: rawData.triesTeam1,
        triesTeam2: rawData.triesTeam2,
        totalTries: rawData.totalTries,
        triesFromLineout: rawData.triesFromLineout,
        triesFromScrum: rawData.triesFromScrum,
        effectiveTimeSeconds: rawData.effectiveTimeSeconds,
        kickingGame: rawData.kickingGame,
        totalRucks: rawData.totalRucks,
        ruckSuccessTeam1: rawData.ruckSuccessTeam1,
        ruckSuccessTeam2: rawData.ruckSuccessTeam2,
        totalScrums: rawData.totalScrums,
        scrumsTeam1: rawData.scrumsTeam1,
        scrumsTeam2: rawData.scrumsTeam2,
        totalLineouts: rawData.totalLineouts,
        lineoutsTeam1: rawData.lineoutsTeam1,
        lineoutsTeam2: rawData.lineoutsTeam2,
        totalPenalties: rawData.totalPenalties,
        penaltiesTeam1: rawData.penaltiesTeam1,
        penaltiesTeam2: rawData.penaltiesTeam2,
        penaltiesDefensiveRuck: rawData.penaltiesDefensiveRuck,
        penaltiesAttackingRuck: rawData.penaltiesAttackingRuck,
        penaltiesOffside: rawData.penaltiesOffside,
        penaltiesTackle: rawData.penaltiesTackle,
        rawRowJson: JSON.stringify(row),
      },
    });

    // Create match team stats for both teams
    await prisma.matchTeamStats.createMany({
      data: [
        {
          matchId: match.id,
          teamId: team1Id,
          isHomeTeam: true,
          points: rawData.pointsTeam1,
          tries: rawData.triesTeam1,
          ruckSuccess: rawData.ruckSuccessTeam1,
          scrums: rawData.scrumsTeam1,
          lineouts: rawData.lineoutsTeam1,
          penalties: rawData.penaltiesTeam1,
        },
        {
          matchId: match.id,
          teamId: team2Id,
          isHomeTeam: false,
          points: rawData.pointsTeam2,
          tries: rawData.triesTeam2,
          ruckSuccess: rawData.ruckSuccessTeam2,
          scrums: rawData.scrumsTeam2,
          lineouts: rawData.lineoutsTeam2,
          penalties: rawData.penaltiesTeam2,
        },
      ],
    });

    // Update TeamRoundStats with calculated league points
    const pointsTeam1 = calculateLeaguePoints(rawData.pointsTeam1, rawData.pointsTeam2, rawData.triesTeam1);
    const pointsTeam2 = calculateLeaguePoints(rawData.pointsTeam2, rawData.pointsTeam1, rawData.triesTeam2);

    try {
      await prisma.teamRoundStats.update({
        where: {
          teamId_round: {
            teamId: team1Id,
            round: rawData.round,
          },
        },
        data: {
          matchPoints: pointsTeam1,
        },
      });
    } catch (error) {
      console.warn(`Could not update stats for team 1 (round ${rawData.round}):`, error);
    }

    try {
      await prisma.teamRoundStats.update({
        where: {
          teamId_round: {
            teamId: team2Id,
            round: rawData.round,
          },
        },
        data: {
          matchPoints: pointsTeam2,
        },
      });
    } catch (error) {
      console.warn(`Could not update stats for team 2 (round ${rawData.round}):`, error);
    }

    matchesProcessed++;
  }

  console.log(`Info Jogo: ${matchesProcessed} matches processed, ${matchesSkipped} skipped`);

  // Summary
  const teamCount = await prisma.team.count();
  const matchCount = await prisma.match.count();
  const roundStatsCount = await prisma.teamRoundStats.count();

  console.log("\n=== Ingest Complete ===");
  console.log(`Teams: ${teamCount}`);
  console.log(`Matches: ${matchCount}`);
  console.log(`Team Round Stats: ${roundStatsCount}`);
  
  return { success: true, teamCount, matchCount };
}
