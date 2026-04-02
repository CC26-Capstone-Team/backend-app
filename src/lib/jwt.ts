import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
  username: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d" as const;

export function signToken(payload: Omit<TokenPayload, keyof JwtPayload>): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
