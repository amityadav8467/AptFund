import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { WalletPicker } from "./components/WalletPicker";
import { CampaignPage } from "./pages/CampaignPage";
import { CreatePage } from "./pages/CreatePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExplorePage } from "./pages/ExplorePage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient();

const Layout = () => (
  <div className="mx-auto min-h-screen max-w-6xl p-4">
    <header className="mb-6 flex items-center justify-between">
      <nav className="flex gap-4 text-sm">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/create">Create</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <WalletPicker />
    </header>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/campaign/:id" element={<CampaignPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </div>
);

function App() {
  return (
    <AptosWalletAdapterProvider autoConnect={false}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </QueryClientProvider>
    </AptosWalletAdapterProvider>
  );
}

export default App;
