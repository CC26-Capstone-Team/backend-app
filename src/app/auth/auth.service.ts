import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { signToken } from "../../lib/jwt.js";
import { AppError } from "../../lib/error.js";
import { isOnboarded } from "./auth.helper.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

/**
 * Registers a new user.
 * Checks if the username is already taken, hashes the password, and saves the user to the database.
 *
 * @param email - The desired email
 * @param password - The plain text password to be hashed
 * @returns The created user's id and username
 * @throws {AppError} 409 if the username is already taken
 */
export async function registerUser(username: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Username already taken");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username: username, email, password: hashed },
  });

  const token = signToken({ id: user.id, email: user.email, username: user.username });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, last_login: new Date() },
  });

  return { user: { id: user.id, email: user.email, is_onboarded: false }, token };
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

  const token = signToken({ id: user.id, email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { token, last_login: new Date() },
  });

  const onboarded = await isOnboarded(user.id);

  return { user: { id: user.id, email: user.email, is_onboarded: onboarded }, token };
}

/**
 * Unified Google Authentication (Login & Auto-Register)
 */
export async function handleGoogleAuth(googleToken: string) {
  // 1. VERIFIKASI KE GOOGLE (Ini yang bikin aman!)
  const ticket = await googleClient.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID as string,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new AppError(401, "Token Google tidak valid atau tidak memiliki email.");
  }

  // DEKLARASI EKSPLISIT untuk memuaskan TypeScript & Prisma
  const email = payload.email as string;
  const googleId = payload.sub as string;
  const name = payload.name;
  const picture = payload.picture;

  // 2. CEK DATABASE (Apakah email atau google_id ini sudah ada?)
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ google_id: googleId }, { email: email }],
    },
  });

  if (!user) {
    // 3A. JIKA BELUM ADA = REGISTER OTOMATIS
    user = await prisma.user.create({
      data: {
        google_id: googleId,
        email: email,
        username: name || email.split("@")[0] || "User",
        avatar_url: picture ?? null,
      },
    });
  } else if (!user.google_id) {
    // 3B. JIKA EMAIL SUDAH ADA (Daftar manual sebelumnya), TAPI BELUM ADA GOOGLE ID
    // Kita "tautkan" akun lamanya dengan Google ID ini
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        google_id: googleId,
        avatar_url: user.avatar_url || picture || null,
      },
    });
  }

  // 4. PROSES LOGIN KEDUA SKENARIO (Buatkan Token Sistem Anda)
  const appToken = signToken({ id: user.id, email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { token: appToken, last_login: new Date() },
  });

  const onboarded = await isOnboarded(user.id);

  return {
    user: { id: user.id, email: user.email, is_onboarded: onboarded },
    token: appToken,
  };
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
