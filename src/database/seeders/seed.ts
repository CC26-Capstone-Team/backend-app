import "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedSkills } from "./skill.seeder.js";

async function main() {
  await seedSkills();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
