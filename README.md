# AuraSci — AI-Powered Open Science Funding

> **From Proof to Capital.**
> Milestone-based open science funding infrastructure powered by AI Agents.

<p align="center">
  <img src="https://img.shields.io/badge/Phase-1%20MVP-00ff88?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Zustand-5-orange?style=for-the-badge" />
</p>

---

## 🧬 What is AuraSci?

AuraSci is a **proof-to-capital loop** for open science:

1. **Scientists** publish research intents with milestone-based funding goals
2. **AI Gatekeeper** screens and verifies research validity
3. **Patrons** provide patronage to promising science
4. **AI Agents** verify milestone completion → funds are released

No tokens. No speculation. Just **verified research → capital flow**.

---

## ✨ Features (Phase 1 MVP)

### 🔬 Scientist Flow
- **Onboarding** — Mock GitHub/ORCID OAuth connection + Lab Profile creation
- **Create Intent Asset** — Define research hypothesis, funding goal, and exactly 3 milestones
- **AI Gatekeeper Screening** — Animated AI review process (mock)
- **Dashboard** — Profile management, status tracking, intent creation

### 💎 Patron Flow
- **Research Market** — Browse AI-verified research intents in a card grid
- **Intent Detail** — Sci-fi card with funding ring, milestone timeline, tags, AI score
- **Patronage** — Fund research with USDC (mock escrow)
- **Portfolio Dashboard** — Track funded intents, milestone progress, and fund status

### 🛡️ AI Trust Loop
- **Green Shield** — AI-verified badge on screened intents
- **Milestone Timeline** — M0 (Fundraising) → M1 → M2 → M3 → R (Result) → SSR (Award)
- **Proof Submission** → **AI Verification** → **Fund Release** (dev tools for testing)

### 📡 Live Activity Feed
- Bloomberg terminal / Matrix-style real-time event stream
- CRT scanline effect + green monospace font
- Auto-logs: patronage, proof submissions, AI verifications, new intents
- Clickable entries → navigate to relevant intent

### 🎨 Visual System
- **Sci-Fi Card Frames** — Neon green/blue gradient borders with rotating glow
- **Corner Accents** — Cyberpunk-style corner highlights
- **Neon Text** — Green/blue glowing typography
- **Halo Ring** — Patron avatar glow effect
- **CRT Terminal** — Scanlines + flicker animation
- **Diagonal Stripes** — Decorative accent elements

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3 |
| State | Zustand 5 (global mock store) |
| Icons | Lucide React |
| Language | TypeScript |
| Data | Mock data (no backend) |

---

## 📁 Project Structure

```
aurasci-mvp/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Global layout + nav
│   │   ├── page.tsx                            # Landing page (/)
│   │   ├── globals.css                         # Sci-fi visual system
│   │   ├── market/
│   │   │   └── page.tsx                        # Research market (/market)
│   │   ├── intent/
│   │   │   └── [id]/
│   │   │       └── page.tsx                    # Intent detail (/intent/:id)
│   │   ├── onboarding/
│   │   │   └── scientist/
│   │   │       └── page.tsx                    # Scientist onboarding
│   │   └── dashboard/
│   │       ├── scientist/
│   │       │   ├── page.tsx                    # Scientist dashboard
│   │       │   └── create-intent/
│   │       │       └── page.tsx                # Create intent form
│   │       └── patron/
│   │           └── page.tsx                    # Patron dashboard
│   ├── components/
│   │   └── ActivityFeed.tsx                    # Terminal-style activity feed
│   ├── store/
│   │   └── index.ts                           # Zustand global store
│   ├── lib/
│   │   └── mock-data.ts                       # Mock scientists, intents, logs
│   └── types/
│       └── index.ts                           # TypeScript type definitions
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
open http://localhost:3000
```

---

## 🎮 Demo Walkthrough

### Full Flow (5 minutes)

1. **Landing Page** → Click **"I'm a Scientist"**
2. **Onboarding** → Connect GitHub (mock) → Fill profile → Submit
3. **Scientist Dashboard** → Click **[Dev] Mock Admin Approve**
4. **Create Intent** → Fill form + 3 milestones → Submit → Watch AI Gatekeeper animation
5. **Market** → See your intent card with AI Screened badge + Activity Feed
6. **Intent Detail** → Explore sci-fi card, fund it, test milestone flow:
   - Click **[Dev] Submit Proof** → See activity log
   - Click **[Dev] AI Verify** → See funds unlocked log
7. **Patron Dashboard** (nav → Portfolio) → View metrics + portfolio

### Quick Demo (Market only)

The app ships with **3 pre-loaded mock intents**:
- `$CELL-01` — Targeting Senescent Cells to Reverse Cardiac Fibrosis (80% funded)
- `$NEUR-01` — Non-Invasive Neural Decoding (22% funded)
- `$GENE-01` — CRISPR Guide RNA Optimization (10% funded)

Just open `/market` and start exploring.

---

## 📐 Data Model

```
ScientistProfile
  ├── status: pending_review | approved
  └── tags: ResearchTag[]

IntentAsset
  ├── status: draft → ai_screening → published → funded → completed
  ├── milestones: Milestone[3]  (strictly 3)
  ├── aiScore: 0-100
  ├── patrons: Patron[]
  ├── backers: Backer[]
  └── resourceAsks: ResourceAsk[]

Milestone
  ├── status: locked → in_progress → proof_submitted → ai_verified → released
  ├── label: M1 | M2 | M3
  └── releaseAmountUSDC: number

ActivityLog
  ├── type: patronage | proof_submitted | ai_verified | intent_published
  └── message: string (with emoji prefix)
```

---

## 🔮 Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| **Phase 1** | ✅ Complete | Frontend MVP, mock data, core flows |
| **Phase 2** | 🔒 Planned | Backend API, wallet integration, real escrow |
| **Phase 3** | 🔒 Planned | Token economics, governance, leaderboard |

> Phase 2/3 navigation items are visible but grayed out with "Phase 1 暂不支持"

---

## 🎨 Design Language

| Element | Style |
|---------|-------|
| Background | `#0a0a0f` dark with grid pattern + gradient orbs |
| Cards | Glassmorphism + neon border glow |
| Sci-Fi Frame | Rotating conic gradient + corner accents |
| Verified Badge | Green Shield with pulse animation |
| Patron Avatars | Purple halo ring glow |
| Activity Feed | CRT scanlines + green monospace |
| Tags | Green / Blue / Purple pill badges |
| Buttons | Gradient fill with hover shadow |

---

## 📝 Terminology

| Term | Meaning |
|------|---------|
| **Intent Asset** | A research proposal published by a scientist |
| **Patronage** | Funding provided by patrons (never "donation") |
| **AI Gatekeeper** | AI agent that screens research intents |
| **Green Shield** | Visual indicator of AI verification |
| **Halo Ring** | Visual effect on patron avatars |
| **Milestone** | One of exactly 3 deliverable checkpoints |

---

## 📄 License

MIT

---

<p align="center">
  <strong>AuraSci</strong> — Where breakthroughs find believers.
</p>
