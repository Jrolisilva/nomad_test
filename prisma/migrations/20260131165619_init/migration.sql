-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MatchPlayerStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "frags" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    CONSTRAINT "MatchPlayerStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KillEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "killerId" INTEGER,
    "victimId" INTEGER NOT NULL,
    "weapon" TEXT NOT NULL,
    "isWorld" BOOLEAN NOT NULL DEFAULT false,
    "occurredAt" DATETIME NOT NULL,
    CONSTRAINT "KillEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KillEvent_killerId_fkey" FOREIGN KEY ("killerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KillEvent_victimId_fkey" FOREIGN KEY ("victimId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE INDEX "MatchPlayerStats_playerId_idx" ON "MatchPlayerStats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayerStats_matchId_playerId_key" ON "MatchPlayerStats"("matchId", "playerId");

-- CreateIndex
CREATE INDEX "KillEvent_matchId_idx" ON "KillEvent"("matchId");

-- CreateIndex
CREATE INDEX "KillEvent_killerId_idx" ON "KillEvent"("killerId");

-- CreateIndex
CREATE INDEX "KillEvent_victimId_idx" ON "KillEvent"("victimId");
