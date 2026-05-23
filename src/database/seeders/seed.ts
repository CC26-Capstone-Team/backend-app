import "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedCareer } from "./career.seeder.js";
import { seedSkills } from "./skill.seeder.js";
import { seedRecommendation } from "./recommendation.seeder.js";
import { seedUsers } from "./user.seeder.js";
import { seedUserProfile } from "./user-profile.seeder.js";
import { seedUserSkills } from "./user-skill.seeder.js";
import { careerSkillSeeder } from "./career-skill.seeder.js";
// import { seedJobOpenings } from "./job.seeder.js";

async function main() {
  await seedUsers();
  await seedUserProfile();
  await seedSkills();
  await seedUserSkills();
  await seedCareer();
  await careerSkillSeeder();
  await seedRecommendation();
  // await seedJobOpenings();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
