-- CreateTable
CREATE TABLE "job_opening" (
    "id" TEXT NOT NULL,
    "career_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "salary" TEXT,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_opening_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_opening" ADD CONSTRAINT "job_opening_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE CASCADE ON UPDATE CASCADE;
