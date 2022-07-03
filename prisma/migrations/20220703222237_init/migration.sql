/*
  Warnings:

  - Changed the type of `memberShipType` on the `Wallet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "memberShipTypes" AS ENUM ('Wallet', 'NFT', 'SPL');

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "memberShipType",
ADD COLUMN     "memberShipType" "memberShipTypes" NOT NULL;
