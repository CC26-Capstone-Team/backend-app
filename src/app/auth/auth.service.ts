import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { signToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";

/**
 * Registers a new user.
 * Checks if the username is already taken, hashes the password, and saves the user to the database.
 *
 * @param email - The desired email
 * @param password - The plain text password to be hashed
 * @returns The created user's id and username
 * @throws {AppError} 409 if the username is already taken
 */
export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Username already taken");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return { id: user.id, email: user.email };
}

export async function registerWithGoogle(googleId: string, email: string, avatarUrl?: string) {
  const existing = await prisma.user.findUnique({ where: { google_id: googleId } });
  if (existing) throw new AppError(409, "Email already registered");

  const user = await prisma.user.create({
    data: {
      google_id: googleId,
      email,
      avatar_url: avatarUrl ?? null,
    },
  });

  return { id: user.id, email: user.email };
}

/**
 * Authenticates a user with username and password.
 * Verifies the password, generates a JWT token, and updates the last login timestamp.
 *
 * @param email - The email to authenticate
 * @param password - The plain text password to verify
 * @returns The authenticated user's data and JWT token
 * @throws {AppError} 401 if the username or password is incorrect
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, "Invalid credentials");
  if (!user.password) throw new AppError(400, "Please login with Google");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const token = signToken({ id: user.id, username: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, last_login: new Date() },
  });

  return { user: { id: user.id, email: user.email }, token };
}

export async function loginWithGoogle(googleId: string) {
  const user = await prisma.user.findUnique({ where: { google_id: googleId } });
  if (!user) throw new AppError(401, "Google account not registered");

  const token = signToken({ id: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, last_login: new Date() },
  });

  return {user: {id: user.id, email: user.email}, token}
}

/**
 * Logs out a user by clearing their token in the database.
 *
 * @param userId - The id of the user to log out
 */
export async function logoutUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { token: null },
  });
}
