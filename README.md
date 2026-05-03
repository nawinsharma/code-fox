<div align="center">

<img src="./public/logo.png" alt="Code Fox" width="120" />

# Code Fox

**AI-powered code reviews for GitHub.**

Connect a repository, open a pull request, and get an instant, context-aware review — grounded in your own codebase.

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Environment](#-environment-variables) · [Project Structure](#-project-structure) · [Plans](#-plans--limits)

</div>

---

##  Features

- **Automated PR reviews** — every `opened` / `synchronize` event triggers a Gemini-powered review that comments back on the PR with actionable feedback.
- **Issue triage & analysis** — newly opened issues are analyzed, classified, and enriched with suggested next steps.
- **Auto-PR generation** — turn an issue into a draft pull request with AI-generated diffs.
- **Codebase-aware AI chat** — ask questions about any indexed repo. Answers are grounded in code via Pinecone-backed RAG.
- **Custom review rules** — define organization-specific style and review rules; they are injected into every review prompt.
- **Repository indexing** — repos are embedded with `gemini-embedding-001` and stored in Pinecone for retrieval.
- **Analytics dashboard** — review activity, usage, logs, and per-repo history.
- **Billing & plans** — Free / Pro tiers with monthly usage caps, powered by Polar.
- **GitHub OAuth** — sign in with GitHub via Better Auth; the same token drives Octokit calls.
- **Background jobs** — Inngest runs reviews, indexing, and analysis off the request path.

---

## 🛠 Tech Stack

| Layer | Choice |
|------|--------|
| Framework | **Next.js 16** (App Router, React 19) |
| Language | **TypeScript** |
| AI | **Vercel AI SDK** + **Google Gemini** (`gemini-2.5-flash`, `gemini-embedding-001`) |
| Vector DB | **Pinecone** |
| Database | **PostgreSQL** + **Prisma 7** |
| Auth | **Better Auth** (GitHub OAuth) |
| Payments | **Polar** (`@polar-sh/better-auth`) |
| Background jobs | **Inngest** |
| GitHub API | **Octokit** |
| UI | **Tailwind CSS v4**, **Radix UI**, **shadcn/ui**, **Motion**, **Recharts**, **xyflow** |
| Forms / validation | **react-hook-form** + **zod** |
| Package manager | **bun** (lockfile) / npm compatible |

---

## 🏗 Architecture

```
                     ┌────────────────────┐
   GitHub Webhook ──►│ /api/webhooks/...  │──► trigger Inngest event
                     └────────────────────┘
                                                │
                                                ▼
                                       ┌────────────────┐
                                       │  Inngest jobs  │
                                       │  ─ review PR   │
                                       │  ─ analyze     │
                                       │    issue       │
                                       │  ─ auto-PR     │
                                       │  ─ index repo  │
                                       └────────┬───────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                     ▼                     ▼
                    ┌──────────┐        ┌──────────────┐       ┌────────────┐
                    │ Pinecone │ ◄───── │  Gemini AI   │ ────► │  Octokit   │
                    │ (RAG)    │        │ (chat/embed) │       │ (comments) │
                    └──────────┘        └──────────────┘       └────────────┘
                          ▲
                          │
                ┌─────────┴─────────┐
                │  Postgres / Prisma│
                │  users, repos,    │
                │  reviews, issues, │
                │  rules, usage     │
                └───────────────────┘
```

**Request flow for a PR review:**

1. GitHub fires the `pull_request` webhook to `/api/webhooks/github`.
2. The route dispatches an Inngest event.
3. The `review` function fetches the diff via Octokit, retrieves relevant context from Pinecone, applies the user's custom rules, and asks Gemini for a review.
4. The review is stored in Postgres and posted back to the PR as a comment.

---

## 🚀 Getting Started

### Prerequisites

- **Node 20+** (or **Bun**)
- **PostgreSQL** database
- **Pinecone** account + index
- **Google AI Studio** API key (for Gemini)
- **GitHub OAuth App** (client id + secret)
- **Polar** account (only needed for billing flows)
- **Inngest** account (or run the dev server locally)

### Install

```bash
# clone
git clone https://github.com/nawinsharma/code-fox.git
cd code-fox

# install deps (bun is preferred — bun.lock is committed)
bun install
# or
npm install
```

### Configure

Create `.env` in the project root and fill it in (see [Environment Variables](#-environment-variables)).

### Database

```bash
# generate Prisma client (also runs on postinstall)
npx prisma generate

# apply migrations
npx prisma migrate dev
```

### Run

```bash
# Next.js dev server
bun dev          # or: npm run dev

# Inngest dev server (separate terminal)
npx inngest-cli dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub.

### Connect a repository

1. Go to **Dashboard → Repositories** and connect a repo you own.
2. Code Fox indexes it into Pinecone (status visible in the UI).
3. Add the webhook on GitHub:
   - **Payload URL:** `https://<your-app>/api/webhooks/github`
   - **Content type:** `application/json`
   - **Events:** Pull requests, Issues
4. Open a PR — the review will appear as a comment within seconds.

---

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_URL` | Public base URL of the app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Same public base URL, exposed to the client |
| `NEXT_PUBLIC_APP_BASE_URL` | Public base URL used by client modules |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client id |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `GITHUB_WEBHOOK_BASE_URL` | Public URL the GitHub webhook should hit (often = `BETTER_AUTH_URL`) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key (used by `@ai-sdk/google`) |
| `PINECONE_DB_API_KEY` | Pinecone API key |
| `PINECONE_INDEX_NAME` | Pinecone index name |
| `PINECONE_CLOUD` | Pinecone cloud (e.g. `aws`) |
| `PINECONE_REGION` | Pinecone region (e.g. `us-east-1`) |
| `POLAR_ACCESS_TOKEN` | Polar API token |
| `POLAR_WEBHOOK_SECRET` | Polar webhook signing secret |
| `POLAR_SUCCESS_URL` | Redirect URL after successful checkout |
| `INNGEST_EVENT_KEY` | Inngest event key (production) |
| `INNGEST_SIGNING_KEY` | Inngest signing key (production) |

---

## 📁 Project Structure

```
code-fox/
├── app/                       # Next.js App Router
│   ├── api/
│   │   ├── auth/              # Better Auth handler
│   │   ├── chat/              # AI chat streaming endpoint
│   │   ├── dashboard/         # Dashboard data endpoints
│   │   ├── inngest/           # Inngest serve handler
│   │   ├── logs/              # Activity logs
│   │   ├── rules/             # Custom rule CRUD
│   │   ├── status/            # Health / status
│   │   └── webhooks/github/   # GitHub webhook receiver
│   ├── dashboard/             # Authenticated dashboard pages
│   │   ├── chat/  logs/  repository/  reviews/  rules/
│   │   ├── settings/  subscriptions/
│   ├── layout.tsx  page.tsx   # Marketing landing
│   └── opengraph-image.tsx
├── components/                # Shared UI (shadcn/Radix wrappers)
├── hooks/                     # Reusable React hooks
├── inngest/
│   ├── client.ts              # Inngest client
│   └── functions/
│       ├── review.ts          # PR review job
│       ├── issue-analysis.ts  # Issue analysis job
│       ├── auto-pr.ts         # Issue → draft PR job
│       └── index.ts           # Indexing job
├── lib/
│   ├── auth.ts  auth-client.ts
│   ├── db.ts                  # Prisma client
│   ├── pinecone.ts            # Pinecone client + index helpers
│   ├── plan-limits.ts         # FREE / PRO usage caps
│   └── landing-config.tsx     # Marketing copy
├── modules/                   # Feature modules (server actions + UI)
│   ├── ai/                    # RAG, embeddings, chat orchestration
│   ├── auth/                  # Sign-in, session helpers
│   ├── chat/                  # Chat UI
│   ├── dashboard/             # Dashboard widgets
│   ├── github/                # Octokit wrappers
│   ├── logs/  payment/  repository/
│   ├── review/                # PR review UI + actions
│   ├── rules/  settings/
├── prisma/
│   ├── schema.prisma          # User, Repository, Review, Issue, Rule, ...
│   └── migrations/
├── public/                    # Static assets (logo, OG images, etc.)
└── package.json
```


## 📜 Scripts

| Command | Description |
|---|---|
| `bun dev` / `npm run dev` | Start Next.js dev server |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `npx prisma migrate dev` | Apply local migrations |
| `npx prisma studio` | Open Prisma Studio |
| `npx inngest-cli dev` | Local Inngest dev server |

---


## 📄 License

MIT — see `LICENSE` for details.
