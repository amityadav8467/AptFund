import { Router } from "express";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { authRequired } from "../middleware/auth.js";
import { aptosService } from "../services/aptos.js";
import { sanitizeText } from "../utils/sanitize.js";

const router = Router();

const oneDay = 24 * 60 * 60 * 1000;
const ninetyDays = 90 * oneDay;

router.get("/", async (req, res, next) => {
  try {
    const active = req.query.active;
    const category = req.query.category;

    const clauses: string[] = [];
    const values: unknown[] = [];

    if (typeof active === "string") {
      values.push(active === "true");
      clauses.push(`is_active = $${values.length}`);
    }

    if (typeof category === "string") {
      values.push(category);
      clauses.push(`category = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await pool.query(
      `SELECT id, on_chain_id, title, description, category, goal_amount, raised_amount, deadline, is_active, created_at
       FROM campaigns ${where} ORDER BY created_at DESC`,
      values
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/", authRequired, async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3).max(200),
      description: z.string().min(10).max(5000),
      category: z.string().min(2).max(50),
      goalAmount: z.coerce.bigint().positive(),
      deadline: z.coerce.date()
    });

    const body = schema.parse(req.body);
    const now = Date.now();
    const deadlineMs = body.deadline.getTime();

    if (deadlineMs - now < oneDay || deadlineMs - now > ninetyDays) {
      res.status(400).json({ error: "Deadline must be between 1 and 90 days from now" });
      return;
    }

    const metadataInsert = await pool.query(
      `INSERT INTO campaigns (creator_id, title, description, category, goal_amount, raised_amount, deadline, is_active)
       VALUES ($1,$2,$3,$4,$5,0,$6,true)
       RETURNING id`,
      [req.user!.id, sanitizeText(body.title), sanitizeText(body.description), sanitizeText(body.category), body.goalAmount.toString(), body.deadline]
    );

    const campaignId = metadataInsert.rows[0].id as string;
    const chain = await aptosService.createCampaignTx({ id: campaignId, ...body });

    await pool.query("UPDATE campaigns SET on_chain_id = $1 WHERE id = $2", [chain.onChainId, campaignId]);

    res.status(201).json({ id: campaignId, onChainId: chain.onChainId, txHash: chain.txHash });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns WHERE id = $1", [req.params.id]);
    const campaign = result.rows[0];
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const chainState = campaign.on_chain_id ? await aptosService.getCampaignState(campaign.on_chain_id) : null;
    res.json({ ...campaign, onChainState: chainState });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authRequired, async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().min(3).max(200).optional(),
      description: z.string().min(10).max(5000).optional(),
      category: z.string().min(2).max(50).optional()
    });

    const body = schema.parse(req.body);
    const existing = await pool.query("SELECT creator_id FROM campaigns WHERE id = $1", [req.params.id]);
    if (!existing.rows[0]) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    if (existing.rows[0].creator_id !== req.user!.id) {
      res.status(403).json({ error: "Only campaign creator can update metadata" });
      return;
    }

    await pool.query(
      `UPDATE campaigns
       SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category)
       WHERE id = $4`,
      [body.title ? sanitizeText(body.title) : null, body.description ? sanitizeText(body.description) : null, body.category ? sanitizeText(body.category) : null, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
