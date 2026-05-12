import { hash } from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export async function seedUsers() {
  const users = ["user@example.com", "user2@example.com", "user3@example.com"];
  const password = "secret123";
  const hashedPassword = await hash(password, 10);

  await prisma.user.createMany({
    data: users.map((user) => ({ email: user, password: hashedPassword })),
    skipDuplicates: true,
  });

  console.log(`✅ Users seeded: ${users.length} users`);
}
