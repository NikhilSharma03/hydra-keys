/*
  Warnings:

  - You are about to drop the column `ownerPubkey` on the `Membership` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Membership" (
    "memberPubkey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareCount" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "walletPubkey" TEXT NOT NULL,

    PRIMARY KEY ("cluster", "walletPubkey", "memberPubkey"),
    CONSTRAINT "Membership_cluster_walletPubkey_fkey" FOREIGN KEY ("cluster", "walletPubkey") REFERENCES "Wallet" ("cluster", "pubkey") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Membership" ("cluster", "createdAt", "memberPubkey", "shareCount", "walletPubkey") SELECT "cluster", "createdAt", "memberPubkey", "shareCount", "walletPubkey" FROM "Membership";
DROP TABLE "Membership";
ALTER TABLE "new_Membership" RENAME TO "Membership";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
