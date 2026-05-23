import { prisma } from "../../lib/prisma.js";

export async function getJobsByCareer(careerId: string) {
  const jobs = await prisma.job_opening.findMany({
    where: { career_id: careerId },
    orderBy: { posted_at: "desc" },
  });

  return jobs;
}
