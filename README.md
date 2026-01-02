# Rugby Analytics Dashboard

Dashboard de analytics para o Campeonato Português de Rugby.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma)
- **Charts**: Recharts
- **Validation**: Zod

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar base de dados

```bash
npx prisma generate
npx prisma db push
```

### 3. Importar dados do Excel

Coloca o ficheiro Excel em `data/report.xlsx` e executa:

```bash
npm run ingest
```

O script espera duas sheets:
- **Info Clubes**: Estatísticas por equipa por jornada
- **Info Jogo**: Estatísticas por jogo

### 4. Executar em desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
rugby-dashboard/
├── data/
│   └── report.xlsx           # Ficheiro Excel com dados
├── prisma/
│   ├── schema.prisma         # Schema da BD
│   └── rugby.db              # Base de dados SQLite
├── scripts/
│   └── ingest.ts             # Script de importação
├── src/
│   ├── app/
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── teams/            # Lista e detalhe de equipas
│   │   └── matches/          # Lista e detalhe de jogos
│   ├── components/
│   │   ├── ui/               # Componentes base (Card, Badge, etc.)
│   │   ├── charts/           # Gráficos (Recharts)
│   │   └── insights/         # Insights determinísticos
│   └── lib/
│       ├── db.ts             # Cliente Prisma
│       └── utils.ts          # Utilitários
└── package.json
```

## Páginas

### Dashboard (`/dashboard`)
- Visão geral da liga
- Classificação
- Gráficos de tendência por jornada
- Filtro por jornada

### Equipas (`/teams`)
- Lista de todas as equipas com stats resumidas
- Clica numa equipa para ver detalhes

### Detalhe de Equipa (`/teams/[team]`)
- Estatísticas agregadas
- Radar dos "4 Pilares" (Ataque, Defesa, Disciplina, Set-Piece)
- Gráficos de evolução
- Análise de penalidades por tipo
- Histórico de jogos

### Jogos (`/matches`)
- Lista de todos os jogos por jornada
- Filtro por jornada

### Detalhe de Jogo (`/matches/[id]`)
- Resultado e score
- Comparação lado-a-lado
- Insights automáticos (determinísticos)
- Análise de penalidades
- Estatísticas de set-piece

## Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run ingest       # Importar dados do Excel
npm run db:studio    # Prisma Studio (GUI da BD)
npm run db:push      # Sincronizar schema
```

## Modelo de Dados

### Team
Equipas do campeonato.

### Match
Informação de cada jogo (Info Jogo).

### MatchTeamStats
Estatísticas por equipa num jogo.

### TeamRoundStats
Estatísticas detalhadas por equipa por jornada (Info Clubes).

## Insights Automáticos

O sistema gera insights determinísticos baseados em:
- Diferencial de pontos (vitória expressiva vs jogo equilibrado)
- Domínio de rucks
- Diferencial de penalidades
- Tipo de penalidades mais frequente
- Domínio de scrums e alinhamentos
- Ensaios de set-piece
- Tempo útil de jogo
- Eficácia ofensiva

## Notas

- O "Tempo Útil" é convertido de formato Excel para segundos
- Percentagens são guardadas como float 0-1
- Linhas "TOTAIS" e "MÉDIA" são ignoradas na importação
- Jornadas futuras (sem dados) são saltadas
