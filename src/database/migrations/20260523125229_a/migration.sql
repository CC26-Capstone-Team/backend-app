/*
  Warnings:

  - You are about to drop the `job_opening` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_opening" DROP CONSTRAINT "job_opening_career_id_fkey";

-- DropTable
DROP TABLE "job_opening";
