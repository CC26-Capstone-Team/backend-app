import { hash } from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export async function seedUsers() {
  const users = [
    { email: "user@example.com", name: "user" },
    { email: "user2@example.com", name: "user2" },
    { email: "user3@example.com", name: "user3" },
  ];
  const password = "secret123";
  const hashedPassword = await hash(password, 10);

  await prisma.user.createMany({
    data: users.map((user) => ({
      username: user.name,
      email: user.email,
      password: hashedPassword,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Users seeded: ${users.length} users`);
}
