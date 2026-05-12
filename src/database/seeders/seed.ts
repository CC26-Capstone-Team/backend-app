import "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedCareer } from "./career.seeder.js";
import { seedSkills } from "./skill.seeder.js";
import { seedRecommendation } from "./recommendation.seeder.js";

async function main() {
  await seedSkills();
  await seedCareer();
  await seedRecommendation();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
