import "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedCareer } from "./career.seeder.js";
import { seedSkills } from "./skill.seeder.js";

async function main() {
  await seedSkills();
  await seedCareer();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
