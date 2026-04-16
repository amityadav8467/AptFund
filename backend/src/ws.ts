import type { Server } from "http";
import { WebSocketServer } from "ws";
import { pool } from "./db/pool.js";

export const attachProgressWs = (server: Server): void => {
  const wsServer = new WebSocketServer({ server, path: "/progress" });

  wsServer.on("connection", (socket, request) => {
    const url = new URL(request.url ?? "/progress", "http://localhost");
    const campaignId = url.searchParams.get("id");
    if (!campaignId) {
      socket.send(JSON.stringify({ error: "Missing campaign id" }));
      socket.close();
      return;
    }

    const sendProgress = async () => {
      const result = await pool.query("SELECT goal_amount, raised_amount FROM campaigns WHERE id = $1", [campaignId]);
      const campaign = result.rows[0];
      if (!campaign) {
        socket.send(JSON.stringify({ error: "Campaign not found" }));
        return;
      }

      const goal = BigInt(campaign.goal_amount);
      const raised = BigInt(campaign.raised_amount);
      const progress = goal > 0n ? Number((raised * 10_000n) / goal) / 100 : 0;
      socket.send(JSON.stringify({ campaignId, goal: goal.toString(), raised: raised.toString(), progress }));
    };

    void sendProgress();
    const interval = setInterval(() => void sendProgress(), 5_000);
    socket.on("close", () => clearInterval(interval));
  });
};
