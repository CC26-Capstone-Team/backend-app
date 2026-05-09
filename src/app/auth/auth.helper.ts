import { prisma } from "../../lib/prisma.js";

export async function isOnboarded(userId: string): Promise<boolean> {
  const profile = await prisma.user_profile.findUnique({
    where: { user_id: userId },
  });

  return !!profile;
}
