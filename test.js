import { generateJobRecommendation } from "./src/app/recommendation/recommendation.service.js";
import { prisma } from "./src/lib/prisma.js";

async function main() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found");
      return;
    }
    const rec = await generateJobRecommendation(user.id, "Backend Developer", true);
    console.log("SUCCESS");
  } catch (error) {
    console.error("ERROR CAUGHT:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
