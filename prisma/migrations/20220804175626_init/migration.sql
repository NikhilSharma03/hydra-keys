-- CreateTable
CREATE TABLE "Wallet" (
    "name" TEXT NOT NULL,
    "pubkey" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "memberShipType" TEXT NOT NULL,
    "acceptSPL" BOOLEAN NOT NULL,
    "splToken" TEXT,
    "totalShares" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("cluster","pubkey")
);

-- CreateTable
CREATE TABLE "Membership" (
    "memberPubkey" TEXT NOT NULL,
    "ownerPubkey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareCount" INTEGER NOT NULL,
    "cluster" TEXT NOT NULL,
    "walletPubkey" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("cluster","walletPubkey","memberPubkey")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_cluster_walletPubkey_fkey" FOREIGN KEY ("cluster", "walletPubkey") REFERENCES "Wallet"("cluster", "pubkey") ON DELETE RESTRICT ON UPDATE CASCADE;
