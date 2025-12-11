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

## Enhancement: Quick Wins Implementation

**Date:** December 10, 2025

**Prompt:**

```
Quick Wins (30-60 min each):
QR Code Generation - Let customers scan to pay
Sound Effects - Add chimes/bells for better alerts
Voice Customization - Let merchants choose voice, speed, volume

lets do this and lets change the speech to use google cloud text-to-speech
```

**Follow-up:**

```
never mind the google text to speech lets keep the current one
```

**Outcome:** Implemented three major enhancements to the merchant soundbox:

1. **QR Code Generation**:

   - Added `qrcode` library
   - Created `/lib/qrcode.ts` utility for QR code generation
   - Integrated QR code display in merchant soundbox with show/hide toggle
   - Added download functionality for QR codes
   - QR codes generated for payment URLs automatically

2. **Sound Effects**:

   - Created `/lib/sounds.ts` with Web Audio API sound generators
   - Implemented three sound effects:
     - Chime (two-tone pleasant sound)
     - Bell (single tone)
     - Cash Register (cha-ching simulation)
   - Added option for no sound effect
   - Sound plays before TTS announcement
   - Test sound button in settings

3. **Voice Customization**:
   - Added controls for voice selection from available system voices
   - Speed slider (0.5x - 2.0x)
   - Pitch slider (0.5 - 2.0)
   - Volume slider (0% - 100%)
   - Live voice test button with current settings
   - Settings panel with show/hide toggle
   - Preserved Web Speech API (decided against Google Cloud TTS for MVP)

**Files Modified:**

- `app/merchant/[id]/page.tsx` - Enhanced with settings UI, QR code display, and customization controls
- Created `lib/sounds.ts` - Sound effect utilities
- Created `lib/qrcode.ts` - QR code generation utility

**Technical Notes:**

- All enhancements use browser APIs (no external service dependencies)
- Sound effects use Web Audio API for synthesized tones
- QR codes generated client-side using `qrcode` library
- Settings persist during session (could add localStorage later)

---

## Enhancement: Advanced Voice Customization

**Date:** December 10, 2025

**Prompt:**

```
can I change how the speech sounds like?
```

**Follow-up:**

```
lets add this
```

**Outcome:** Implemented advanced voice customization features:

1. **Voice Presets** (6 presets):

   - Professional (👔): Clear and formal (rate: 0.9, pitch: 1.0)
   - Friendly (😊): Warm and welcoming (rate: 1.0, pitch: 1.1)
   - Excited (🎉): Energetic and upbeat (rate: 1.2, pitch: 1.3)
   - Calm (😌): Soothing and relaxed (rate: 0.8, pitch: 0.9)
   - Robotic (🤖): Mechanical and precise (rate: 1.0, pitch: 0.7)
   - Custom (⚙️): User-defined settings with fine-tune controls

2. **Message Templates** (8 templates):

   - English variations:
     - Default: "Payment received: {amount} pesos from {customer}"
     - Formal: "Transaction completed. Amount: {amount} pesos. Customer: {customer}"
     - Friendly: "Great! {customer} just paid {amount} pesos. Thank you!"
     - Short: "{amount} pesos from {customer}"
   - Tagalog variations:
     - Default: "May bayad na: {amount} pesos mula kay {customer}"
     - Friendly: "Salamat! Si {customer} ay nagbayad ng {amount} pesos"
   - Spanish:
     - Default: "Pago recibido: {amount} pesos de {customer}"
   - Custom template with editable text area

3. **Language Support**:

   - Automatic language detection from template
   - Support for English (en-US), Tagalog (tl-PH), Spanish (es-ES)
   - TTS utterance uses template's language code

4. **UI Improvements**:
   - Visual preset selector grid with emojis and descriptions
   - Live preview of formatted message before testing
   - Fine-tune controls only shown when "Custom" preset selected
   - Better organized settings panel with sections
   - Enhanced test button with gradient styling

**Files Created:**

- `lib/voice-presets.ts` - Voice preset configurations, message templates, and formatting utilities

**Files Modified:**

- `app/merchant/[id]/page.tsx` - Integrated presets, templates, and advanced customization UI

**Technical Implementation:**

- Preset system applies pre-configured rate/pitch/volume settings
- Message templates use placeholder replacement ({amount}, {customer})
- Custom preset unlocks fine-tune sliders
- Template selection updates TTS language automatically
- Formatting utility handles decimal places and variable substitution

---

## Enhancement: Customer Wallet Interface

**Date:** December 12, 2025

**Prompt:**

```
build the customer wallet
```

**Outcome:** Implemented a comprehensive customer wallet interface mimicking GCash design:

1. **Main Wallet Dashboard** (`/wallet`):

   - Header with GCash branding and Help button
   - User switcher component with dropdown
   - Tab navigation (Wallet, Save, Borrow, Insure)
   - Balance display with show/hide toggle
   - Action buttons grid (Send, Load, Transfer, Bills, GSave, Cards, A+ Rewards, Commute)
   - Explore Services section (US Account, GInsure, Food Hub, Travel, GForest)
   - Shortcuts section (Pay QR, Scan to Pay, Bank Transfer, etc.)
   - Promo carousel
   - Referral section
   - New features section
   - Transactions summary with View All link

2. **QR Code Scanner** (`/wallet/qr`):

   - Live camera QR code scanning using `html5-qrcode` library
   - Real-time QR detection with visual feedback
   - Manual merchant ID entry fallback
   - Camera permission handling
   - Supports multiple QR code formats (merchant ID, /pay/merchantId, full URLs)
   - Auto-navigation to payment page after successful scan
   - Tips section for better scanning
   - Clean dark UI optimized for camera usage

3. **Supporting Pages**:

   - `/inbox` - Inbox page (placeholder)
   - `/transactions` - Transaction history page (placeholder)
   - `/profile` - Profile settings page (placeholder)

4. **Reusable Components**:

   - `UserSwitcher.tsx` - User profile switcher with dropdown
     - Shows current user avatar, name, and balance
     - Dropdown to switch between 3 demo users
     - Persists selection to localStorage
     - Smooth animations and transitions
   - `BottomNavigation.tsx` - Navigation bar with 5 tabs
     - Home, Inbox, QR, Transactions, Profile
     - Active state indication
     - Icon-based navigation
     - Responsive design

5. **Wallet Users System** (`lib/wallet-users.ts`):
   - 3 demo users: Juan dela Cruz, Maria Santos, Pedro Reyes
   - User data structure with id, name, balance, avatar
   - localStorage persistence utilities
   - Default user fallback

**New Dependencies:**

- `html5-qrcode` - QR code scanning library
- `lucide-react` - Icon library

**Files Created:**

- `app/wallet/page.tsx` - Main wallet dashboard
- `app/wallet/qr/page.tsx` - QR scanner page
- `app/inbox/page.tsx` - Inbox placeholder
- `app/transactions/page.tsx` - Transactions placeholder
- `app/profile/page.tsx` - Profile placeholder
- `components/wallet/UserSwitcher.tsx` - User switcher component
- `components/wallet/BottomNavigation.tsx` - Bottom navigation component
- `lib/wallet-users.ts` - Wallet user data and utilities

**Technical Highlights:**

- Client-side QR scanning with camera access
- localStorage for user preference persistence
- Responsive mobile-first design
- Smooth animations and transitions
- Error handling for camera permissions
- Clean component architecture with reusable parts
- TypeScript type safety throughout
- Tailwind CSS for consistent styling

**User Experience Features:**

- One-tap user switching
- Quick access to QR scanner from bottom nav
- Visual feedback on active navigation items
- Graceful fallback to manual entry if camera fails
- Clean, familiar GCash-inspired interface
- Fast navigation between wallet features

---

## Next Steps

<!-- Add future prompts here as development progresses -->
