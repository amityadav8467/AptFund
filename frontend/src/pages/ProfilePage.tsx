import { VerificationBadge } from "../components/VerificationBadge";

export const ProfilePage = () => (
  <section className="space-y-3">
    <h1 className="text-2xl font-bold">Profile</h1>
    <VerificationBadge verified={false} />
    <p className="text-slate-300">Complete Aptos Keyless login and submit ZK proof to /auth/verify.</p>
  </section>
);
