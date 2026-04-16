import { useWallet } from "@aptos-labs/wallet-adapter-react";

export const WalletPicker = () => {
  const { account, connect, disconnect, wallets } = useWallet();

  if (account) {
    return (
      <button onClick={() => void disconnect()} className="rounded bg-slate-700 px-3 py-1 text-sm">
        Disconnect {account.address.toString().slice(0, 8)}...
      </button>
    );
  }

  const firstWallet = wallets[0];
  return (
    <button
      onClick={() => {
        if (firstWallet) {
          void connect(firstWallet.name);
        }
      }}
      className="rounded bg-indigo-500 px-3 py-1 text-sm"
    >
      Connect Wallet
    </button>
  );
};
