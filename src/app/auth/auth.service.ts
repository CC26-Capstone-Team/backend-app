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

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const token = signToken({ id: user.id, username: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, last_login: new Date() },
  });

  return { user: { id: user.id, email: user.email }, token };
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
