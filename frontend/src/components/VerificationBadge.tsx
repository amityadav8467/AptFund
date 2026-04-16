export const VerificationBadge = ({ verified }: { verified: boolean }) => (
  <span className={`rounded px-2 py-1 text-xs font-semibold ${verified ? "bg-emerald-600" : "bg-amber-600"}`}>
    {verified ? "ZK Verified" : "Not Verified"}
  </span>
);
