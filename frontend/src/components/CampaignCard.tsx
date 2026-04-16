import { Link } from "react-router-dom";
import type { Campaign } from "../lib/api";

const octasToApt = (octas: string): string => (Number(octas) / 1e8).toFixed(2);

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const goal = Number(campaign.goal_amount);
  const raised = Number(campaign.raised_amount);
  const progress = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="text-lg font-semibold">{campaign.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{campaign.description}</p>
      <div className="mt-3 text-xs text-slate-400">Goal: {octasToApt(campaign.goal_amount)} APT</div>
      <div className="mt-2 h-2 overflow-hidden rounded bg-slate-700">
        <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1 text-xs text-slate-300">{progress.toFixed(1)}%</div>
      <Link to={`/campaign/${campaign.id}`} className="mt-3 inline-block rounded bg-indigo-500 px-3 py-1 text-sm font-medium hover:bg-indigo-400">
        Fund
      </Link>
    </article>
  );
};
