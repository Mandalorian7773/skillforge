## Initia Hackathon Submission - **Project Name**: SkillForge

### Project Overview
SkillForge is a full-stack Web3 competitive gaming platform that replaces centralized payout servers with transparent on-chain execution. It allows gamers to stake tokens, answer rapid-fire challenges, and instantly receive trustless payouts. It provides a secure, decentralized meritocracy where skill is the only currency.

### Implementation Detail
- **The Custom Implementation**: We developed a custom Initia AppChain (`skillforge-1`) with a Move smart contract acting as the trustless arbiter. The contract securely holds entry fees, validates match completion signals from a Node.js sync engine, and executes instant payouts to the winner.
- **The Native Feature**: We used the `auto-signing` and Session UX features via InterwovenKit to ensure players can participate in rapid-fire gameplay without constant wallet popups, dramatically improving the user experience during high-pressure matches.

### How to Run Locally
1. **Backend**: `cd backend && npm install && npm run dev` (Runs on `http://localhost:3456`)
2. **Frontend**: `cd frontend && npm install && npm run dev` (Runs on `http://localhost:5173`)
3. **Smart Contract**: Deploy locally using `minitiad move publish --from deployer --chain-id skillforge-1`

---

# SkillForge ⚡

**Skill-based competitive earning platform on Initia**

### 🔗 Live Links
- **Frontend Deployment**: [https://skillforge101.netlify.app](https://skillforge101.netlify.app)
- **Backend API**: [https://skillforge-ahqz.onrender.com](https://skillforge-ahqz.onrender.com)
SkillForge is a full-stack Web3 competitive gaming platform. 
1. **AppChain**: A custom Initia Rollup (`skillforge-1`) with Move smart contracts acting as the trustless arbiter, securing entry fees and executing instant payouts.
2. **Backend**: A Node.js engine that synchronizes matches, serves challenges, and manages time-based scoring to prevent cheating.
3. **Frontend**: A sleek React/Tailwind UI built with glassmorphism, using InterwovenKit for seamless blockchain interactions.

## 🏗️ Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js + Express |
| Blockchain | Initia MoveVM (custom appchain) |
| Wallet | InterwovenKit (`@initia/interwovenkit-react`) |
| Chain ID | `skillforge-1` |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3456
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Smart Contract
```bash
# Requires initiad CLI and weave
cd contracts/skillforge
initiad move build --named-addresses "skillforge=<YOUR_ADDRESS>"
initiad tx move publish <bytecode> --from <key> --chain-id skillforge-1
```

## 🎮 How It Works

1. **Connect Wallet** — InterwovenKit connects to the SkillForge appchain
2. **Create Match** — Set entry fee (0.1-100 INIT) and max players (2-5)
3. **Join Match** — Pay entry fee, which goes into the prize pool escrow
4. **Compete** — Answer 5 timed questions across difficulty tiers
5. **Win Rewards** — Highest scorer wins 95% of the pool; 5% platform fee

## 🔗 On-Chain Flow

Every critical action triggers a real blockchain transaction:

| Action | Contract Function | What Happens |
|--------|------------------|-------------|
| Create Match | `create_match` | Entry fee transferred to escrow |
| Join Match | `join_match` | Entry fee transferred to escrow |
| Submit Score | `submit_score` | Admin oracle records score on-chain |
| Declare Winner | `declare_winner` | Highest score wins |
| Claim Reward | `distribute_rewards` | 95% pool → winner, 5% → treasury |

## 🧠 Adaptive Difficulty

The backend uses an AI-powered difficulty engine:

- **Easy** → if avg score < 40% (last 10 matches)
- **Medium** → default tier
- **Hard** → if avg score > 80% (last 10 matches)

## 💰 Revenue Model

- **5% platform fee** on every match
- Scalable to tournaments, leagues, and premium content

## 📜 Smart Contract (Move)

Located in `contracts/skillforge/`:

```move
// Core functions (all with real token transfers):
create_match(entry_fee, max_players, asset_metadata)
join_match(match_id, asset_metadata)
start_match(match_id)
submit_score(match_id, player, score)
declare_winner(match_id)
distribute_rewards(match_id, asset_metadata)
```

## 🔒 Security

- **No answer leaks**: Questions endpoint strips `correctAnswer` and `explanation`
- **Wallet-gated gameplay**: Cannot play without connected wallet
- **Server-side validation**: Match status, player membership, entry fees all validated
- **On-chain escrow**: Entry fees held in contract, not backend
- **Auth on complete**: Only match participants can trigger completion

## 🌐 Initia Native Features

- **InterwovenKit Integration**: Full wallet connection and transaction signing
- **Custom Appchain**: Dedicated `skillforge-1` chain for optimal performance
- **Auto-signing / Session UX**: Pre-approved transaction patterns for seamless gameplay

## 📁 Project Structure

```
SkillFi/
├── .initia/
│   └── submission.json      # Hackathon submission manifest
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # useContractTx hook
│   │   ├── pages/            # Route pages
│   │   ├── providers/        # WalletProvider (InterwovenKit)
│   │   ├── services/         # API + blockchain services
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Constants + helpers
│   └── eslint.config.js      # ESLint flat config
├── backend/
│   └── src/
│       ├── routes/           # Express API routes
│       ├── services/         # Match service + game logic
│       └── data/             # Question pool
└── contracts/
    └── skillforge/
        ├── Move.toml
        └── sources/
            └── skillforge.move
```

## 📋 Hackathon Submission

- **Project**: SkillForge
- **Chain ID**: skillforge-1
- **VM**: MoveVM
- **Wallet**: InterwovenKit
- **Native Feature**: Auto-signing / Session UX

---

Built for the INITIATE Hackathon on Initia 🌊
