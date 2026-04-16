const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type Campaign = {
  id: string;
  title: string;
  description: string;
  category: string;
  goal_amount: string;
  raised_amount: string;
  deadline: string;
  is_active: boolean;
};

export const api = {
  async listCampaigns(): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE}/campaigns`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to load campaigns");
    return response.json() as Promise<Campaign[]>;
  },
  async getCampaign(id: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE}/campaigns/${id}`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to load campaign");
    return response.json() as Promise<Campaign>;
  },
  async contribute(id: string, amount: string): Promise<{ txHash: string }> {
    const response = await fetch(`${API_BASE}/fund/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });
    if (!response.ok) throw new Error("Funding failed");
    return response.json() as Promise<{ txHash: string }>;
  }
};
