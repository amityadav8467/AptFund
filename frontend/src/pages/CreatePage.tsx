export const CreatePage = () => {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Create Campaign</h1>
      <p className="text-slate-300">Use backend POST /campaigns with wallet-signed payload and on-chain transaction dispatch.</p>
      <div className="rounded bg-slate-900 p-4 text-sm text-slate-200">Multi-step form can collect title, category, goal, deadline and description.</div>
    </section>
  );
};
