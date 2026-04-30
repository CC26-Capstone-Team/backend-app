-- CreateTable
CREATE TABLE "career_requirement" (
    "career_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "min_gpa" DECIMAL(3,2),

    CONSTRAINT "career_requirement_pkey" PRIMARY KEY ("career_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "career_requirement" ADD CONSTRAINT "career_requirement_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_requirement" ADD CONSTRAINT "career_requirement_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
