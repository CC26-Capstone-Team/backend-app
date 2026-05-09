import { prisma } from "../../lib/prisma.js";

export async function getAllSkill() {
  return prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
