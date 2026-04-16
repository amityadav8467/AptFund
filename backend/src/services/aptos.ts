import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { env } from "../config/env.js";

const network = env.aptosNetwork === "mainnet" ? Network.MAINNET : env.aptosNetwork === "testnet" ? Network.TESTNET : Network.DEVNET;
const client = new Aptos(new AptosConfig({ network, fullnode: env.aptosNodeUrl }));

export const aptosService = {
  async getCampaignState(onChainId: string): Promise<Record<string, unknown>> {
    return { onChainId, network: env.aptosNetwork };
  },
  async createCampaignTx(payload: Record<string, unknown>): Promise<{ txHash: string; onChainId: string }> {
    void client;
    return { txHash: `sim_${Date.now()}`, onChainId: String(payload.id ?? Date.now()) };
  },
  async contributeTx(campaignId: string, amount: bigint): Promise<{ txHash: string }> {
    return { txHash: `fund_${campaignId}_${amount}_${Date.now()}` };
  },
  async withdrawTx(campaignId: string): Promise<{ txHash: string }> {
    return { txHash: `withdraw_${campaignId}_${Date.now()}` };
  },
  async refundTx(campaignId: string): Promise<{ txHash: string }> {
    return { txHash: `refund_${campaignId}_${Date.now()}` };
  }
};
