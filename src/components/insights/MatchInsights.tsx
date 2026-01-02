import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface InsightsData {
  team1Name: string;
  team2Name: string;
  pointsTeam1: number;
  pointsTeam2: number;
  triesTeam1: number;
  triesTeam2: number;
  ruckSuccessTeam1: number;
  ruckSuccessTeam2: number;
  penaltiesTeam1: number;
  penaltiesTeam2: number;
  penaltiesDefensiveRuck: number;
  penaltiesAttackingRuck: number;
  penaltiesOffside: number;
  penaltiesTackle: number;
  scrumsTeam1: number;
  scrumsTeam2: number;
  totalScrums: number;
  lineoutsTeam1: number;
  lineoutsTeam2: number;
  totalLineouts: number;
  effectiveTimeSeconds: number;
  triesFromLineout: number;
  triesFromScrum: number;
}

interface MatchInsightsProps {
  data: InsightsData;
}

interface Insight {
  type: "positive" | "negative" | "neutral";
  icon: string;
  text: string;
}

function generateInsights(data: InsightsData): Insight[] {
  const insights: Insight[] = [];

  // Points differential
  const pointsDiff = Math.abs(data.pointsTeam1 - data.pointsTeam2);
  if (pointsDiff >= 30) {
    const winner = data.pointsTeam1 > data.pointsTeam2 ? data.team1Name : data.team2Name;
    insights.push({
      type: "positive",
      icon: "🏆",
      text: `Vitória expressiva de ${winner} por ${pointsDiff} pontos de diferença.`,
    });
  } else if (pointsDiff <= 7) {
    insights.push({
      type: "neutral",
      icon: "⚔️",
      text: `Jogo equilibrado com apenas ${pointsDiff} pontos de diferença.`,
    });
  }

  // Ruck success comparison
  const ruckDiff = Math.abs(data.ruckSuccessTeam1 - data.ruckSuccessTeam2);
  if (ruckDiff >= 0.1) {
    const betterTeam =
      data.ruckSuccessTeam1 > data.ruckSuccessTeam2 ? data.team1Name : data.team2Name;
    const betterRate = Math.max(data.ruckSuccessTeam1, data.ruckSuccessTeam2);
    insights.push({
      type: "positive",
      icon: "💪",
      text: `${betterTeam} dominou os rucks com ${(betterRate * 100).toFixed(0)}% de sucesso.`,
    });
  }

  // Penalty differential
  const penaltyDiff = Math.abs(data.penaltiesTeam1 - data.penaltiesTeam2);
  if (penaltyDiff >= 5) {
    const moreUndisciplined =
      data.penaltiesTeam1 > data.penaltiesTeam2 ? data.team1Name : data.team2Name;
    const count = Math.max(data.penaltiesTeam1, data.penaltiesTeam2);
    insights.push({
      type: "negative",
      icon: "🟨",
      text: `${moreUndisciplined} cometeu ${count} penalidades (${penaltyDiff} a mais que o adversário).`,
    });
  }

  // Penalty type analysis
  const totalPenalties =
    data.penaltiesDefensiveRuck +
    data.penaltiesAttackingRuck +
    data.penaltiesOffside +
    data.penaltiesTackle;

  if (totalPenalties > 0) {
    const penaltyTypes = [
      { name: "ruck defensivo", count: data.penaltiesDefensiveRuck },
      { name: "ruck atacante", count: data.penaltiesAttackingRuck },
      { name: "fora de jogo", count: data.penaltiesOffside },
      { name: "placagem", count: data.penaltiesTackle },
    ].sort((a, b) => b.count - a.count);

    if (penaltyTypes[0].count >= 4) {
      insights.push({
        type: "negative",
        icon: "⚠️",
        text: `Maior incidência de penalidades em ${penaltyTypes[0].name} (${penaltyTypes[0].count} ocorrências).`,
      });
    }
  }

  // Scrum dominance
  if (data.totalScrums > 0) {
    const scrumWinRate1 = data.scrumsTeam1 / data.totalScrums;
    const scrumWinRate2 = data.scrumsTeam2 / data.totalScrums;
    if (scrumWinRate1 >= 0.7 || scrumWinRate2 >= 0.7) {
      const dominant = scrumWinRate1 > scrumWinRate2 ? data.team1Name : data.team2Name;
      const rate = Math.max(scrumWinRate1, scrumWinRate2);
      insights.push({
        type: "positive",
        icon: "🔄",
        text: `${dominant} dominou os scrums com ${(rate * 100).toFixed(0)}% de posse.`,
      });
    }
  }

  // Lineout dominance
  if (data.totalLineouts > 0) {
    const lineoutWinRate1 = data.lineoutsTeam1 / data.totalLineouts;
    const lineoutWinRate2 = data.lineoutsTeam2 / data.totalLineouts;
    if (lineoutWinRate1 >= 0.65 || lineoutWinRate2 >= 0.65) {
      const dominant = lineoutWinRate1 > lineoutWinRate2 ? data.team1Name : data.team2Name;
      const rate = Math.max(lineoutWinRate1, lineoutWinRate2);
      insights.push({
        type: "positive",
        icon: "📏",
        text: `${dominant} controlou os alinhamentos com ${(rate * 100).toFixed(0)}% de sucesso.`,
      });
    }
  }

  // Set-piece tries
  const setPieceTries = data.triesFromLineout + data.triesFromScrum;
  const totalTries = data.triesTeam1 + data.triesTeam2;
  if (totalTries > 0 && setPieceTries >= 3) {
    const percentage = (setPieceTries / totalTries) * 100;
    insights.push({
      type: "neutral",
      icon: "🎯",
      text: `${setPieceTries} ensaios originados de set-piece (${percentage.toFixed(0)}% do total).`,
    });
  }

  // Effective time
  const effectiveMinutes = data.effectiveTimeSeconds / 60;
  if (effectiveMinutes >= 35) {
    insights.push({
      type: "positive",
      icon: "⏱️",
      text: `Alto tempo útil de jogo (${effectiveMinutes.toFixed(0)} minutos) - jogo fluído.`,
    });
  } else if (effectiveMinutes <= 25) {
    insights.push({
      type: "negative",
      icon: "⏱️",
      text: `Baixo tempo útil (${effectiveMinutes.toFixed(0)} minutos) - muitas interrupções.`,
    });
  }

  // Try-scoring efficiency
  if (data.triesTeam1 >= 5 || data.triesTeam2 >= 5) {
    const topScorer = data.triesTeam1 > data.triesTeam2 ? data.team1Name : data.team2Name;
    const tries = Math.max(data.triesTeam1, data.triesTeam2);
    insights.push({
      type: "positive",
      icon: "🏉",
      text: `${topScorer} mostrou grande eficácia ofensiva com ${tries} ensaios.`,
    });
  }

  return insights.slice(0, 5); // Limit to 5 insights
}

export function MatchInsights({ data }: MatchInsightsProps) {
  const insights = generateInsights(data);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Destaques do Jogo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                insight.type === "positive"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : insight.type === "negative"
                  ? "bg-red-50 dark:bg-red-900/20"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <span className="text-xl">{insight.icon}</span>
              <p
                className={`text-sm ${
                  insight.type === "positive"
                    ? "text-green-800 dark:text-green-200"
                    : insight.type === "negative"
                    ? "text-red-800 dark:text-red-200"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
