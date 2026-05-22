/*
  Warnings:

  - You are about to drop the column `career` on the `course_recommendation` table. All the data in the column will be lost.
  - Added the required column `career_id` to the `course_recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_recommendation" DROP COLUMN "career",
ADD COLUMN     "career_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "course_recommendation" ADD CONSTRAINT "course_recommendation_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
