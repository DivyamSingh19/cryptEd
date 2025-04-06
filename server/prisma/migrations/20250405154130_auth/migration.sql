/*
  Warnings:

  - Made the column `email` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `walletAddress` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institution` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `walletAddress` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institution` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL,
ALTER COLUMN "institution" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL,
ALTER COLUMN "institution" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
