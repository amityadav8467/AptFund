import { useQuery } from "@tanstack/react-query";
import { CampaignCard } from "../components/CampaignCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { api } from "../lib/api";

export const ExplorePage = () => {
  const campaigns = useQuery({ queryKey: ["campaigns", "all"], queryFn: api.listCampaigns });

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Explore Campaigns</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.isLoading && Array.from({ length: 6 }).map((_, idx) => <LoadingSkeleton key={idx} />)}
        {campaigns.data?.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
      </div>
    </section>
  );
};
