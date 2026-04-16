import { useState } from "react";
import type { FormEvent } from "react";

export const FundModal = ({
  open,
  onClose,
  onSubmit
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (amountOctas: string) => Promise<void>;
}) => {
  const [value, setValue] = useState("100000000");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(value);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded bg-slate-900 p-4">
        <h3 className="text-lg font-semibold">Fund Campaign</h3>
        <label className="mt-3 block text-sm">Amount (Octas)</label>
        <input value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 w-full rounded bg-slate-800 p-2" />
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="rounded bg-slate-700 px-3 py-1">Cancel</button>
          <button disabled={loading} className="rounded bg-indigo-500 px-3 py-1">{loading ? "Sending..." : "Confirm"}</button>
        </div>
      </form>
    </div>
  );
};
