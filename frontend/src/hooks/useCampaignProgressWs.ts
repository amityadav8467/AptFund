import { useEffect, useState } from "react";

export const useCampaignProgressWs = (campaignId: string | undefined) => {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const wsBase = import.meta.env.VITE_WS_URL ?? "ws://localhost:4000/progress";
    const socket = new WebSocket(`${wsBase}?id=${campaignId}`);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { progress?: number };
        if (typeof payload.progress === "number") {
          setProgress(payload.progress);
        }
      } catch (error) {
        console.error("Failed to parse campaign progress payload", error);
        setProgress(null);
      }
    };

    return () => socket.close();
  }, [campaignId]);

  return progress;
};
