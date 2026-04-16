import dotenv from "dotenv";

dotenv.config();

const requireEnv = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: requireEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/aptfund"),
  jwtSecret: requireEnv("JWT_SECRET", "dev-secret-change-me"),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  aptosNetwork: process.env.APTOS_NETWORK ?? "devnet",
  aptosNodeUrl: process.env.APTOS_NODE_URL ?? "https://fullnode.devnet.aptoslabs.com/v1"
};
