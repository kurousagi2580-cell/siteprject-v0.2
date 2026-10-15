import { createHmac } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export class RateLimitUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RateLimitUnavailableError"
  }
}

let limiter: Ratelimit | undefined

function getHashKey(): string {
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!token) throw new RateLimitUnavailableError("Upstash Redis is not configured")
  return token
}

function getLimiter(): Ratelimit {
  const url = process.env.UPSTASH_REDIS_REST_URL
  if (!url) {
    throw new RateLimitUnavailableError("Upstash Redis is not configured")
  }
  const token = getHashKey()

  limiter ??= new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "comments",
  })
  return limiter
}

export function hashClientIp(ip: string): string {
  return createHmac("sha256", getHashKey()).update(ip).digest("hex")
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const result = await getLimiter().limit(hashClientIp(ip))
  return !result.success
}
