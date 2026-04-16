import { useQuery } from "@tanstack/react-query";
import { CampaignCard } from "../components/CampaignCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { api } from "../lib/api";

export const LandingPage = () => {
  const campaigns = useQuery({ queryKey: ["campaigns", "featured"], queryFn: api.listCampaigns });

  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">AptFund</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {campaigns.isLoading && Array.from({ length: 3 }).map((_, idx) => <LoadingSkeleton key={idx} />)}
        {campaigns.data?.slice(0, 3).map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
      </div>
    </section>
  );
};
