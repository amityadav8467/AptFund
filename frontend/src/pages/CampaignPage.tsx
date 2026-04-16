import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DeadlineTimer } from "../components/DeadlineTimer";
import { FundModal } from "../components/FundModal";
import { FundingProgress } from "../components/FundingProgress";
import { useCampaignProgressWs } from "../hooks/useCampaignProgressWs";
import { api } from "../lib/api";
import { useUiStore } from "../store/uiStore";

export const CampaignPage = () => {
  const { id = "" } = useParams();
  const progressLive = useCampaignProgressWs(id);
  const queryClient = useQueryClient();
  const ui = useUiStore();

  const campaign = useQuery({ queryKey: ["campaign", id], queryFn: () => api.getCampaign(id), enabled: Boolean(id) });

  const contribute = useMutation({
    mutationFn: (amount: string) => api.contribute(id, amount),
    onMutate: async (amount) => {
      await queryClient.cancelQueries({ queryKey: ["campaign", id] });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof api.getCampaign>>>(["campaign", id]);
      if (previous) {
        const nextRaised = (BigInt(previous.raised_amount) + BigInt(amount)).toString();
        queryClient.setQueryData(["campaign", id], { ...previous, raised_amount: nextRaised });
      }
      return { previous };
    },
    onError: (_error, _amount, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["campaign", id], context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    }
  });

  if (campaign.isLoading) return <div className="h-40 animate-pulse rounded bg-slate-800" />;
  if (campaign.isError || !campaign.data) return <div>Failed to load campaign.</div>;

  const goal = Number(campaign.data.goal_amount);
  const raised = Number(campaign.data.raised_amount);
  const progressComputed = goal > 0 ? (raised / goal) * 100 : 0;
  const progress = progressLive ?? progressComputed;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">{campaign.data.title}</h1>
      <p className="text-slate-300">{campaign.data.description}</p>
      <DeadlineTimer deadline={campaign.data.deadline} />
      <FundingProgress progress={progress} />
      <button onClick={ui.openFundModal} className="rounded bg-indigo-500 px-4 py-2">Fund</button>
      <FundModal
        open={ui.isFundModalOpen}
        onClose={ui.closeFundModal}
        onSubmit={async (amount) => {
          await contribute.mutateAsync(amount);
        }}
      />
    </section>
  );
};
