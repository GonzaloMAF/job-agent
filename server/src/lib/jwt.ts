import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

export interface TokenPayload {
  userId: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  return decoded as unknown as TokenPayload
}
