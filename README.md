# CodeFox

AI-powered code review platform. Connects to GitHub repositories and provides automated, intelligent review feedback on pull requests.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Vercel AI SDK + Anthropic + Google
- **Database:** PostgreSQL + Prisma
- **Vector Store:** Pinecone
- **Auth:** Better Auth (GitHub OAuth)
- **Background Jobs:** Inngest
- **Payments:** Polar
- **UI:** Tailwind CSS + Radix UI + shadcn/ui

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in required values: DATABASE_URL, GitHub OAuth, Anthropic API key, Pinecone, etc.

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
