import rateLimit from "express-rate-limit";

export const contributionLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? "unknown-ip"
});
