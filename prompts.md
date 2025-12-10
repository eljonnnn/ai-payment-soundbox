# Development Prompts Log

This document tracks all prompts used during the development of the Payment Soundbox MVP for reference and documentation purposes.

---

## Initial Architecture Planning

**Date:** December 10, 2025

**Prompt:**
```
Role: Act as a Senior Full Stack Architect specializing in Next.js 15, Prisma, and Fintech applications.

Project Goal: Build a "Payment Soundbox" MVP. A Merchant's device announces payments via voice (TTS) the instant a customer completes a mock transaction.

Tech Stack:

Framework: Next.js 15 (App Router) with React 19.

ORM: Prisma (connecting to Supabase PostgreSQL).

Database & Realtime: Supabase (PostgreSQL for data, Supabase Realtime for listeners).

Styling: Tailwind CSS.

Deployment: Vercel.

Core Features to Plan:

Database & Schema:

Define a schema.prisma file with Merchant and Transaction models.

Crucial: We need RLS enabled on Supabase, but Prisma usually bypasses RLS when used server-side. Please define a strategy (e.g., using Prisma for server-side Wallet actions, and Supabase Client for client-side Merchant subscriptions).

Merchant App (Soundbox):

Route: /merchant/[id]

Logic: A Client Component that uses the supabase-js client to subscribe to .on('postgres_changes') for the Transaction table.

Audio: Triggers window.speechSynthesis on new inserts.

Customer App (Mock Wallet):

Route: /pay/[merchantId]

Logic: A Server Action payMerchant(formData) that uses Prisma Client to insert the transaction.

Deliverable: Please provide a step-by-step Implementation Plan (in Markdown).

Step 1: schema.prisma definition and the SQL needed to enable Realtime on the Supabase table.

Step 2: Project initialization (Next.js + Prisma setup).

Step 3: The Hybrid Strategy: Configuring the shared Supabase client for Realtime while using Prisma for database writes.

Step 4: The "Audio Context" strategy (handling browser auto-play).

Step 5: Documentation plan.

Constraint: Do not write the full application code yet. Provide the architectural plan first for my review.
```

**Outcome:** Created comprehensive implementation plan in `plan-paymentSoundbox.prompt.md`

---

## Refinement: Implementation Decisions

**Date:** December 10, 2025

**Prompt:**
```
implement RLS policies on Supabase
single COMPLETED status for MVP simplicity.
Prisma seed script with 2-3 test merchants for immediate testing.
```

**Outcome:** Plan updated with:
- RLS policies defined in SQL
- Single COMPLETED status for transactions
- Seed script with 3 Filipino-themed merchant names

---

## Refinement: Project Structure

**Date:** December 10, 2025

**Prompt:**
```
npx create-next-app@latest ai-payment-soundbox --typescript --tailwind --app --no-src-dir

replace this with 

npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

**Outcome:** Updated initialization command to create project in current directory

---

## Full Implementation

**Date:** December 10, 2025

**Prompt:**
```
Follow instructions in plan-paymentSoundbox.prompt.md.
```

**Outcome:** Complete MVP implementation including:
- Next.js 15 project initialization with TypeScript, Tailwind CSS, and App Router
- Prisma installation and configuration with PostgreSQL datasource
- Database schema with Merchant and Transaction models
- Environment variables template (.env.local)
- Supabase setup documentation (supabase-setup.md) with RLS policies
- Hybrid database strategy implementation:
  - lib/prisma.ts (server-side client)
  - lib/supabase.ts (client-side realtime client)
- Customer wallet route (app/pay/[merchantId]/page.tsx) with Server Action
- Merchant soundbox route (app/merchant/[id]/page.tsx) with realtime subscription and TTS
- Seed script (prisma/seed.ts) with 3 Filipino-themed test merchants
- Package.json configuration for Prisma seed command
- Comprehensive README.md with setup instructions, architecture overview, and troubleshooting
- Custom home page (app/page.tsx) with project overview and setup checklist

---

## Documentation Maintenance Request

**Date:** December 10, 2025

**Prompt:**
```
always update the prompts.md
```

**Outcome:** Updated prompts.md to include full implementation details and established practice of always documenting prompts

---

## Next Steps

<!-- Add future prompts here as development progresses -->
