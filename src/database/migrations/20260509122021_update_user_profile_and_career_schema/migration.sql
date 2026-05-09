/*
  Warnings:

  - You are about to drop the column `type` on the `skill` table. All the data in the column will be lost.
  - You are about to drop the column `is_onboarded` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `career_requirement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `career` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `education_level` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "career_requirement" DROP CONSTRAINT "career_requirement_career_id_fkey";

-- DropForeignKey
ALTER TABLE "career_requirement" DROP CONSTRAINT "career_requirement_skill_id_fkey";

-- AlterTable
ALTER TABLE "skill" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_onboarded",
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_profile" ADD COLUMN     "education_level" TEXT NOT NULL,
ALTER COLUMN "gpa" DROP NOT NULL;

-- DropTable
DROP TABLE "career_requirement";

-- CreateIndex
CREATE UNIQUE INDEX "career_title_key" ON "career"("title");
