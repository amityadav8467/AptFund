import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { authRequired } from "../middleware/auth.js";
import { contributionLimiter } from "../middleware/rateLimiter.js";
import { aptosService } from "../services/aptos.js";

const router = Router();

router.post("/:id", authRequired, contributionLimiter, async (req, res, next) => {
  try {
    const campaignId = String(req.params.id);
    const body = z.object({ amount: z.coerce.bigint().positive() }).parse(req.body);
    const tx = await aptosService.contributeTx(campaignId, body.amount);

    await pool.query(
      `INSERT INTO contributions (campaign_id, backer_id, amount, tx_hash)
       VALUES ($1, $2, $3, $4)`,
      [campaignId, req.user!.id, body.amount.toString(), tx.txHash]
    );

    await pool.query("UPDATE campaigns SET raised_amount = raised_amount + $1 WHERE id = $2", [body.amount.toString(), campaignId]);

    res.status(201).json({ txHash: tx.txHash });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/backers", async (req, res, next) => {
  try {
    const campaignId = String(req.params.id);
    const result = await pool.query(
      `SELECT c.amount, c.tx_hash, c.created_at, u.aptos_address
       FROM contributions c
       JOIN users u ON u.id = c.backer_id
       WHERE campaign_id = $1
       ORDER BY c.created_at DESC`,
      [campaignId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
