/*
  Warnings:

  - Added the required column `splToken` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wallet" (
    "name" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "memberShipType" TEXT NOT NULL,
    "acceptSPL" BOOLEAN NOT NULL,
    "splToken" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("cluster", "pubkey")
);
INSERT INTO "new_Wallet" ("acceptSPL", "authority", "cluster", "memberShipType", "name", "pubkey", "totalShares", "validated") SELECT "acceptSPL", "authority", "cluster", "memberShipType", "name", "pubkey", "totalShares", "validated" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
