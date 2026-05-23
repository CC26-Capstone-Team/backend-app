/*
  Warnings:

  - Added the required column `via` to the `job_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_item" ADD COLUMN     "via" TEXT NOT NULL;
