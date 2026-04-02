import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { signToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";

export async function registerUser(username: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new AppError(409, "Username already taken");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed },
  });

  const token = signToken({ id: user.id, username: user.username });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, lastLogin: new Date() },
  });

  return { user: { id: user.id, username: user.username }, token };
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const token = signToken({ id: user.id, username: user.username });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, lastLogin: new Date() },
  });

  return { user: { id: user.id, username: user.username }, token };
}

export async function logoutUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { token: null },
  });
}
