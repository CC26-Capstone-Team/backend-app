-- CreateTable
CREATE TABLE "job_recommendation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career_id" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "last_fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_item" (
    "id" TEXT NOT NULL,
    "job_recommendation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "apply_link" TEXT,
    "match_score" INTEGER,
    "match_reason" TEXT,

    CONSTRAINT "job_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "job_recommendation" ADD CONSTRAINT "job_recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_recommendation" ADD CONSTRAINT "job_recommendation_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_item" ADD CONSTRAINT "job_item_job_recommendation_id_fkey" FOREIGN KEY ("job_recommendation_id") REFERENCES "job_recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
