import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import campaignRoutes from "./routes/campaigns.js";
import fundingRoutes from "./routes/funding.js";
import refundRoutes from "./routes/refunds.js";
import { env } from "./config/env.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));

  app.use("/auth", authRoutes);
  app.use("/campaigns", campaignRoutes);
  app.use("/fund", fundingRoutes);
  app.use("/campaigns", refundRoutes);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(400).json({ error: err instanceof Error ? err.message : "Unexpected error" });
  });

  return app;
};
