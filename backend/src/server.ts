import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { startIndexer } from "./indexer.js";
import { attachProgressWs } from "./ws.js";

const app = createApp();
const server = http.createServer(app);
attachProgressWs(server);
const indexerInterval = startIndexer();

server.listen(env.port, () => {
  console.log(`AptFund backend listening on ${env.port}`);
});

const shutdown = async (): Promise<void> => {
  clearInterval(indexerInterval);
  await pool.end();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
