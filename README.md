# AptFund

Full-stack Aptos crowdfunding platform with Move smart contracts, TypeScript backend API, and React frontend.

## 1) Move smart contracts

### File structure

```text
contracts/AptFund/
  Move.toml
  sources/
    crowdfund.move
    contribution.move
    refund.move
    identity.move
```

### Commands

```bash
cd /home/runner/work/AptFund/AptFund/contracts/AptFund
aptos move test
aptos move publish --network devnet
```

## 2) Backend API (Node.js + Express + TypeScript)

### File structure

```text
backend/
  .env.example
  package.json
  tsconfig.json
  migrations/
    001_init.sql
  src/
    app.ts
    server.ts
    indexer.ts
    ws.ts
    config/env.ts
    db/pool.ts
    middleware/
      auth.ts
      rateLimiter.ts
    routes/
      auth.ts
      campaigns.ts
      funding.ts
      refunds.ts
    services/aptos.ts
    utils/sanitize.ts
```

### Environment variables

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/aptfund
JWT_SECRET=change-me
FRONTEND_ORIGIN=http://localhost:5173
APTOS_NETWORK=devnet
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
```

### Commands

```bash
cd /home/runner/work/AptFund/AptFund/backend
npm install
npm run check
npm run build
npm run dev
```

## 3) Frontend (React + Vite + TypeScript + Tailwind)

### File structure

```text
frontend/
  .env.example
  package.json
  tailwind.config.ts
  postcss.config.js
  src/
    App.tsx
    main.tsx
    index.css
    lib/api.ts
    store/uiStore.ts
    hooks/useCampaignProgressWs.ts
    components/
      CampaignCard.tsx
      DeadlineTimer.tsx
      FundModal.tsx
      FundingProgress.tsx
      LoadingSkeleton.tsx
      VerificationBadge.tsx
      WalletPicker.tsx
    pages/
      CampaignPage.tsx
      CreatePage.tsx
      DashboardPage.tsx
      ExplorePage.tsx
      LandingPage.tsx
      ProfilePage.tsx
```

### Environment variables

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000/progress
```

### Commands

```bash
cd /home/runner/work/AptFund/AptFund/frontend
npm install
npm run build
npm run dev
```
