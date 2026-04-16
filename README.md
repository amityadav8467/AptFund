# AptFund

A full-stack Aptos crowdfunding platform built with Move smart contracts, TypeScript backend API, and React frontend with Tailwind CSS styling.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Project Overview

AptFund is a decentralized crowdfunding platform deployed on the Aptos blockchain. It allows users to:
- Create crowdfunding campaigns
- Contribute funds to campaigns
- Request refunds if campaigns fail
- Verify user identity on-chain
- Track campaign progress in real-time

### Key Features
- **Move Smart Contracts**: Secure on-chain campaign and contribution management
- **TypeScript Backend**: RESTful API with WebSocket support for real-time updates
- **React Frontend**: Modern UI with Tailwind CSS and wallet integration
- **Database**: PostgreSQL for off-chain data persistence
- **Real-time Updates**: WebSocket integration for live campaign progress

## ✅ Prerequisites

Before you start, ensure you have installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (v9.0.0+)
- **PostgreSQL** (v14.0+) - [Download](https://www.postgresql.org/)
- **Aptos CLI** - Install via: `curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3`
- **TypeScript** (v5.0+)
- **Git**

## 📁 Project Structure

```
AptFund/
├── contracts/
│   └── AptFund/
│       ├── Move.toml
│       └── sources/
│           ├── crowdfund.move
│           ├── contribution.move
│           ├── refund.move
│           └── identity.move
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── migrations/
│   │   └── 001_init.sql
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── indexer.ts
│       ├── ws.ts
│       ├── config/env.ts
│       ├── db/pool.ts
│       ├── middleware/
│       │   ├── auth.ts
│       │   └── rateLimiter.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── campaigns.ts
│       │   ├── funding.ts
│       │   └── refunds.ts
│       ├── services/aptos.ts
│       └── utils/sanitize.ts
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── lib/api.ts
│       ├── store/uiStore.ts
│       ├── hooks/useCampaignProgressWs.ts
│       ├── components/
│       │   ├── CampaignCard.tsx
│       │   ├── DeadlineTimer.tsx
│       │   ├── FundModal.tsx
│       │   ├── FundingProgress.tsx
│       │   ├── LoadingSkeleton.tsx
│       │   ├── VerificationBadge.tsx
│       │   └── WalletPicker.tsx
│       └── pages/
│           ├── CampaignPage.tsx
│           ├── CreatePage.tsx
│           ├── DashboardPage.tsx
│           ├── ExplorePage.tsx
│           ├── LandingPage.tsx
│           └── ProfilePage.tsx
└── README.md
```

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amityadav8467/AptFund.git
cd AptFund
```

### 2. Set Up Move Smart Contracts

```bash
cd contracts/AptFund

# Install Aptos Move dependencies
aptos move download-deps --network devnet

# Test the smart contracts
aptos move test

# Build the contracts
aptos move build
```

### 3. Set Up Backend

```bash
cd ../../backend

# Copy environment configuration
cp .env.example .env

# Install Node dependencies
npm install

# Create and seed the PostgreSQL database
# Update DATABASE_URL in .env first
npm run migrate  # if migration scripts available

# Type check the TypeScript code
npm run check

# Build the TypeScript
npm run build
```

#### Backend Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/aptfund

# JWT Configuration
JWT_SECRET=change-me-to-a-secure-random-string

# CORS Configuration
FRONTEND_ORIGIN=http://localhost:5173

# Aptos Configuration
APTOS_NETWORK=devnet
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
```

### 4. Set Up Frontend

```bash
cd ../frontend

# Copy environment configuration
cp .env.example .env

# Install Node dependencies
npm install

# Build the TypeScript
npm run build
```

#### Frontend Environment Variables (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000/progress
```

## 🏃 Running the Application

### Option 1: Development Mode (Local Testing)

#### Start PostgreSQL Database

```bash
# macOS with Homebrew
brew services start postgresql

# Linux with systemd
sudo systemctl start postgresql

# Or use Docker
docker run --name aptfund-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

#### Start Backend Server (Terminal 1)

```bash
cd backend
npm run dev
# Backend will run on http://localhost:4000
```

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

#### Publish Smart Contracts (Terminal 3)

```bash
cd contracts/AptFund
aptos move publish --network devnet
# Deploy contracts to Aptos Devnet
# Copy the deployed contract address for backend configuration
```

### Option 2: Production Build & Run

#### Build Backend

```bash
cd backend
npm run build
npm start
```

#### Build Frontend

```bash
cd frontend
npm run build
# Generates optimized build in dist/ directory
```

## 🌐 Deployment

### Backend Deployment (Node.js)

#### Option 1: Deploy to Heroku

```bash
# Create Heroku app
heroku create aptfund-backend

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secure-secret
heroku config:set APTOS_NETWORK=mainnet
heroku config:set APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com/v1
heroku config:set FRONTEND_ORIGIN=https://your-frontend-domain.com

# Deploy
git push heroku main
```

#### Option 2: Deploy to Docker

```bash
# Create Dockerfile in backend directory
docker build -t aptfund-backend .
docker run -p 4000:4000 --env-file .env aptfund-backend
```

#### Option 3: Deploy to Cloud Platforms (AWS, GCP, Azure)

```bash
# Build production bundle
npm run build

# Deploy dist/ directory using platform-specific tools
# AWS: aws s3 sync dist/ s3://bucket-name/
# GCP: gcloud app deploy
# Azure: az webapp up
```

### Frontend Deployment

#### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel
```

#### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=frontend/dist
```

#### Option 3: Deploy to GitHub Pages

```bash
cd frontend

# Update vite.config.ts base path
# base: '/AptFund/'

npm run build

# Push dist/ to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

### Smart Contracts Deployment

#### Publish to Aptos Mainnet

```bash
cd contracts/AptFund

# Update Move.toml if needed
aptos move publish --network mainnet --assume-yes

# Wait for transaction confirmation
# Save the published package address
```

## 📡 API Documentation

### Base URL

- Development: `http://localhost:4000`
- Production: `https://api.aptfund.com` (example)

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Campaigns
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create new campaign (requires auth)
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

#### Funding
- `POST /api/funding/contribute` - Contribute to campaign
- `GET /api/funding/history` - Get funding history

#### Refunds
- `POST /api/refunds/request` - Request refund
- `GET /api/refunds/status/:id` - Check refund status

### WebSocket Endpoint

- `ws://localhost:4000/progress` - Real-time campaign progress updates

## 📦 Dependencies

### Backend
- **Express** (v5.1.0) - Web framework
- **@aptos-labs/ts-sdk** (v6.3.1) - Aptos blockchain integration
- **pg** (v8.16.3) - PostgreSQL driver
- **jsonwebtoken** (v9.0.2) - JWT authentication
- **helmet** (v8.1.0) - Security headers
- **express-rate-limit** (v8.1.0) - Rate limiting
- **ws** (v8.18.3) - WebSocket support
- **zod** (v4.1.12) - Schema validation
- **xss** (v1.0.15) - XSS protection

### Frontend
- **React** (v19.2.4) - UI library
- **Vite** (v8.0.4) - Build tool
- **TypeScript** (~6.0.2) - Type safety
- **Tailwind CSS** (v4.2.2) - Styling
- **React Router** (v7.14.1) - Routing
- **@aptos-labs/wallet-adapter-react** (v8.3.3) - Wallet integration
- **@tanstack/react-query** (v5.99.0) - Server state management
- **Zustand** (v5.0.12) - Client state management

### Smart Contracts
- **Aptos Framework** (mainnet) - Core Move framework

## 🔒 Security Considerations

- Change `JWT_SECRET` to a strong random string in production
- Use environment variables for all sensitive data
- Enable rate limiting on API endpoints
- Implement CORS properly for production domains
- Regularly update dependencies for security patches
- Use HTTPS in production
- Validate all user inputs server-side
- Use helmet middleware for security headers

## 🧪 Testing

```bash
# Test smart contracts
cd contracts/AptFund
aptos move test

# Type check backend
cd ../../backend
npm run check

# Build verification
npm run build

# Lint frontend
cd ../frontend
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running on port 5432
- Verify DATABASE_URL format in .env
- Check database credentials

### Aptos Network Issues
- Verify APTOS_NODE_URL is correct for the network
- Check your internet connection
- Confirm Aptos CLI is installed: `aptos --version`

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found Errors
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear package lock: `rm package-lock.json && npm install`
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support & Contact

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy coding! 🚀**