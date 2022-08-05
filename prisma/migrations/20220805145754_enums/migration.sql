/*
  Warnings:

  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `cluster` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `memberShipType` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cluster` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "memberShipTypes" AS ENUM ('Wallet', 'NFT', 'SPL');

-- CreateEnum
CREATE TYPE "clusters" AS ENUM ('devnet', 'mainnet_beta');

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_cluster_walletPubkey_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pkey",
DROP COLUMN "cluster",
ADD COLUMN     "cluster" "clusters" NOT NULL,
ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("cluster", "walletPubkey", "memberPubkey");

-- AlterTable
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_pkey",
DROP COLUMN "memberShipType",
ADD COLUMN     "memberShipType" "memberShipTypes" NOT NULL,
DROP COLUMN "cluster",
ADD COLUMN     "cluster" "clusters" NOT NULL,
ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY ("cluster", "pubkey");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_cluster_walletPubkey_fkey" FOREIGN KEY ("cluster", "walletPubkey") REFERENCES "Wallet"("cluster", "pubkey") ON DELETE RESTRICT ON UPDATE CASCADE;
