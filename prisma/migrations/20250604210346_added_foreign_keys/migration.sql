/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Client_Info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Provider_Info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Client_Info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Provider_Info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client_Info" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Provider_Info" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Client_Info_user_id_key" ON "Client_Info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_Info_user_id_key" ON "Provider_Info"("user_id");

-- AddForeignKey
ALTER TABLE "Provider_Info" ADD CONSTRAINT "Provider_Info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client_Info" ADD CONSTRAINT "Client_Info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
