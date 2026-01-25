type RateLimitConfig = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export class RateLimiter {
  private config: RateLimitConfig;
  private tokens: Map<string, number[]>;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.tokens = new Map();
  }

  check(limit: number, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const windowStart = now - this.config.interval;

      const timestamps = this.tokens.get(token) || [];
      
      const validTimestamps = timestamps.filter((timestamp) => timestamp > windowStart);

      if (validTimestamps.length >= limit) {
        reject(new Error("Rate limit exceeded"));
        return;
      }

      validTimestamps.push(now);
      this.tokens.set(token, validTimestamps);
      
      if (this.tokens.size > this.config.uniqueTokenPerInterval) {
        this.tokens.clear();
        this.tokens.set(token, validTimestamps);
      }

      resolve();
    });
  }
}

export const messageRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export const authRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});
