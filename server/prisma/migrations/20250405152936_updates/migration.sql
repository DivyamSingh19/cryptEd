/*
  Warnings:

  - You are about to drop the column `department` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `schoolOrCollege` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "department",
DROP COLUMN "schoolOrCollege",
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL,
ALTER COLUMN "institution" DROP NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateIndex
CREATE UNIQUE INDEX "Professor_walletAddress_key" ON "Professor"("walletAddress");
