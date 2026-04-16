import { useEffect, useState } from "react";

const format = (ms: number): string => {
  if (ms <= 0) return "Ended";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${h}h ${m}m`;
};

export const DeadlineTimer = ({ deadline }: { deadline: string }) => {
  const [remaining, setRemaining] = useState(() => new Date(deadline).getTime() - Date.now());
  useEffect(() => {
    const timer = setInterval(() => setRemaining(new Date(deadline).getTime() - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return <span className="text-sm text-slate-300">{format(remaining)}</span>;
};
