import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db/pool.js";
import { env } from "../config/env.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/login", (_req, res) => {
  res.json({ message: "Initiate Aptos Keyless OAuth from frontend" });
});

router.post("/verify", async (req, res, next) => {
  try {
    const schema = z.object({ aptosAddress: z.string().length(66), zkProof: z.string().min(1) });
    const body = schema.parse(req.body);

    const upsert = await pool.query(
      `INSERT INTO users (aptos_address, is_zk_verified)
       VALUES ($1, true)
       ON CONFLICT (aptos_address)
       DO UPDATE SET is_zk_verified = true
       RETURNING id, aptos_address, is_zk_verified`,
      [body.aptosAddress]
    );

    const user = upsert.rows[0];
    const token = jwt.sign({ id: user.id, aptosAddress: user.aptos_address, isZkVerified: user.is_zk_verified }, env.jwtSecret, {
      expiresIn: "1d"
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax"
    });

    res.json({ id: user.id, aptosAddress: user.aptos_address, isZkVerified: user.is_zk_verified, verified: true, proofAccepted: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authRequired, async (req, res) => {
  const result = await pool.query("SELECT id, aptos_address, is_zk_verified FROM users WHERE id = $1", [req.user!.id]);
  if (!result.rows[0]) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: result.rows[0].id,
    aptosAddress: result.rows[0].aptos_address,
    isZkVerified: result.rows[0].is_zk_verified
  });
});

export default router;
