import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { pool } from "../db/pool.js";
import { aptosService } from "../services/aptos.js";

const router = Router();

router.post("/:id/withdraw", authRequired, async (req, res, next) => {
  try {
    const campaignId = String(req.params.id);
    const creatorCheck = await pool.query("SELECT creator_id FROM campaigns WHERE id = $1", [campaignId]);
    if (creatorCheck.rows[0]?.creator_id !== req.user!.id) {
      res.status(403).json({ error: "Only creator can withdraw" });
      return;
    }

    const tx = await aptosService.withdrawTx(campaignId);
    await pool.query("UPDATE campaigns SET is_active = false WHERE id = $1", [campaignId]);
    res.json({ txHash: tx.txHash });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/refund", authRequired, async (req, res, next) => {
  try {
    const tx = await aptosService.refundTx(String(req.params.id));
    res.json({ txHash: tx.txHash });
  } catch (error) {
    next(error);
  }
});

export default router;
