Quero que cries um POC web (primeiro só web) para analytics de rugby a partir de um Excel do campeonato português.

Contexto:
- Sou treinador e software developer.
- Quero uma app fullstack (mas POC web primeiro) com ingestão de dados do Excel, normalização, BD e UI em React com infográficos.
- Stack preferida: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts + Prisma + SQLite (POC).
- Quero código pronto a correr com scripts de ingestão e páginas principais.

Dados (Excel):
Há 2 sheets:

1) "Info Jogo" (nível jogo):
Colunas:
Equipa 1, Equipa 2, Jornada, Árbitro,
Pontos Equipa 1, Pontos Equipa 2, Pontos Jogo,
Ensaios Equipa 1, Ensaios Equipa 2, Ensaios Jogo,
Ensaios AL, Ensaios FO,
Tempo Útil, Jogo ao Pé,
Rucks, Ruck Sucesso E1, Ruck Sucesso E2,
FO's, FO Equipa 1, FO Equipa 2,
AL's, AL Equipa 1, AL Equipa 2,
Penalidades, Penalidades Equipa 1, Penalidades Equipa 2,
Penalidades Ruck Defensivo, Penalidades Ruck Atacante, Penalidades Fora de Jogo, Penalidades Placagem
Nota: existem linhas finais "TOTAIS" e "MÉDIA" e linhas vazias — devem ser ignoradas.

2) "Info Clubes" (nível equipa por jornada):
Colunas:
Equipa, Jornada,
Pontos Marcados, Pontos Sofridos, Pontos Jogo,
Ensaios Marcados, Ensaios Sofridos, Ensaios Jogo,
Ensaios AL, Ensaios FO, Ensaios Turnover, Ensaios CA, Ensaios TAP, Ensaios PS,
Tempo Útil,
Posse de Bola (Minutos), Posse de Bola (%),
Jogo ao Pé,
Placagens Feitas, Placagens Falhadas, % Sucesso Placagem, Quebras de Linha,
Rucks, Ruck Sucesso,
FO's, FO's Sucesso, FO's Reset,
AL's, AL's Sucesso,
Penalidades Concedidas, Ruck Defensivo, Ruck Atacante, Fora de Jogo, Placagem, AL / Maul, FO, Outras

Requisitos de normalização:
- Converter "Tempo Útil" para segundos (tempo_util_seconds).
- Percentagens/sucessos guardar como float 0–1 internamente.
- snake_case para nomes internos.
- Guardar raw_row_json para debug.
- Separar em tabelas: teams, matches, match_team_stats, team_round_stats.

Entregáveis:
1) Prisma schema (SQLite) + seed/ingest.
2) Script de ingestão do Excel (assume que o ficheiro está em /data/report.xlsx) que:
   - lê as duas sheets
   - limpa linhas inválidas
   - normaliza tipos/unidades
   - popula a BD
3) Next.js UI:
   - /dashboard: overview da liga + filtros por jornada
   - /teams: lista de equipas
   - /teams/[team]: dashboard da equipa (cards + charts)
   - /matches: lista de jogos + filtro jornada
   - /matches/[id]: detalhe do jogo com comparativo side-by-side
4) Componentes de gráficos (Recharts):
   - line chart de trends por jornada
   - stacked bar ou donut de penalidades por tipo
   - radar ou barras para “4 pilares”: Ataque/Defesa/Disciplina/Set-piece
5) Pequenas “insights” determinísticas no match page:
   - ex: “maior diferencial em penalidades fora de jogo”, “ruck success superior”, etc (sem ML)

Constrangimentos:
- Não inventar dados em falta.
- Código simples, legível, com zod validation (ou equivalente).
- Instruções de setup no README (pnpm/npm ok).

Começa por:
A) sugerir o schema Prisma
B) desenhar a estrutura do projeto
C) depois escrever o código (ingest + páginas + componentes) em blocos.
