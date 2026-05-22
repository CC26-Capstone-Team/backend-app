-- CreateTable
CREATE TABLE "course_recommendation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_item" (
    "id" TEXT NOT NULL,
    "course_recommendation_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "course_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_recommendation" ADD CONSTRAINT "course_recommendation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_item" ADD CONSTRAINT "course_item_course_recommendation_id_fkey" FOREIGN KEY ("course_recommendation_id") REFERENCES "course_recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
