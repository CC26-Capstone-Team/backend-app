import "../../lib/env.js";
import { prisma } from "../../lib/prisma.js";

async function main() {
  // tambahkan seeder di sini
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
