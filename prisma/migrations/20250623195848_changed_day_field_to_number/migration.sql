/*
  Warnings:

  - You are about to drop the column `firstname` on the `UserInformation` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `UserInformation` table. All the data in the column will be lost.
  - Changed the type of `Start_time` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `End_time` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Start_time` on the `Client_Info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `End_time` on the `Client_Info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `UserInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "Start_time",
ADD COLUMN     "Start_time" TIMESTAMP(3) NOT NULL,
DROP COLUMN "End_time",
ADD COLUMN     "End_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Client_Info" DROP COLUMN "Start_time",
ADD COLUMN     "Start_time" TIMESTAMP(3) NOT NULL,
DROP COLUMN "End_time",
ADD COLUMN     "End_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserInformation" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "name" TEXT NOT NULL;
