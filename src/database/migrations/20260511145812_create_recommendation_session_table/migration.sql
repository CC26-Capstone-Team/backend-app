/*
  Warnings:

  - You are about to drop the column `created_at` on the `recommendation_history` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `recommendation_history` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `recommendation_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recommendation_history" DROP CONSTRAINT "recommendation_history_user_id_fkey";

-- AlterTable
ALTER TABLE "recommendation_history" DROP COLUMN "created_at",
DROP COLUMN "user_id",
ADD COLUMN     "session_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "recommendation_session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recommendation_session" ADD CONSTRAINT "recommendation_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_history" ADD CONSTRAINT "recommendation_history_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "recommendation_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
