import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
  username: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d" as const;

/**
 * Signs a JWT token with the given payload.
 *
 * @param payload - The data to encode in the token (id and username)
 * @returns A signed JWT token string
 */
export function signToken(payload: Omit<TokenPayload, keyof JwtPayload>): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies and decodes a JWT token.
 *
 * @param token - The JWT token string to verify
 * @returns The decoded token payload
 * @throws {JsonWebTokenError} if the token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
