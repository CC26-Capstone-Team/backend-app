-- CreateTable
CREATE TABLE "career_skill" (
    "career_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "career_skill_pkey" PRIMARY KEY ("career_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "career_skill" ADD CONSTRAINT "career_skill_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_skill" ADD CONSTRAINT "career_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
