import { pool } from "./db/pool.js";

export const startIndexer = (): NodeJS.Timeout => {
  return setInterval(async () => {
    await pool.query("SELECT id FROM campaigns WHERE is_active = true");
  }, 30_000);
};
