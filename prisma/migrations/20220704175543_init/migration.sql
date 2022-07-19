-- CreateTable
CREATE TABLE "Wallet" (
    "name" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "memberShipType" TEXT NOT NULL,
    "acceptSPL" BOOLEAN NOT NULL,
    "splToken" TEXT NOT NULL,
    "minPubKey" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("cluster", "pubkey")
);

-- CreateTable
CREATE TABLE "Membership" (
    "memberPubkey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareCount" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "walletPubkey" TEXT NOT NULL,

    PRIMARY KEY ("cluster", "walletPubkey", "memberPubkey"),
    CONSTRAINT "Membership_cluster_walletPubkey_fkey" FOREIGN KEY ("cluster", "walletPubkey") REFERENCES "Wallet" ("cluster", "pubkey") ON DELETE RESTRICT ON UPDATE CASCADE
);
