import rateLimit from "express-rate-limit";

export const contributionLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]?.trim();
    return req.user?.id ?? forwardedIp ?? req.ip ?? req.socket.remoteAddress ?? `anon-${req.method}-${req.originalUrl}`;
  }
});
