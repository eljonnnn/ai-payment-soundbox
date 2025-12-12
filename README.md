# GCash Payment Soundbox 🔊

A modern, real-time payment notification system with intelligent voice announcements for merchants. Built with Next.js 16, Prisma, and Supabase Realtime.

![Payment Soundbox](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwind-css)

## ✨ Overview

GCash Payment Soundbox is a production-ready payment notification system that provides merchants with instant audio alerts when customers complete transactions. With a professional desktop interface for merchants and a mobile-optimized wallet for customers, the application demonstrates the power of real-time technology in fintech.

## 🎯 Key Features

### 🔊 Merchant Soundbox (Desktop)

- **Real-Time Audio Notifications**: Sub-second payment alerts with customizable voice announcements
- **Multi-Merchant Support**: Seamlessly switch between merchant accounts without page reload
- **Customizable Voice Settings**: 6 voice presets (Professional, Friendly, Excited, Calm, Robotic, Custom)
- **Multi-Language Templates**: English, Tagalog, and Spanish message templates
- **Sound Effects**: Chime, Bell, and Cash Register sound options
- **Live Analytics Dashboard**: Real-time revenue, transaction count, and averages
- **QR Code Generation**: Instant QR code creation with download, share, and copy features
- **Transaction History**: Animated transaction list with date grouping
- **Audio Settings Drawer**: Comprehensive voice and sound customization panel

### 💳 Customer Wallet (Mobile)

- **GCash-Inspired Interface**: Familiar mobile-first design
- **QR Code Scanner**: Live camera-based QR scanning with html5-qrcode
- **User Switching**: Switch between multiple demo users instantly
- **Quick Actions**: Send, Load, Transfer, Bills payment shortcuts
- **Bottom Navigation**: 5-tab navigation (Home, Inbox, QR, Transactions, Profile)
- **Balance Display**: Show/hide balance toggle for privacy
- **Transaction History**: Complete payment history with filtering

### 🌐 Landing Page

- **Professional Portal**: Modern, animated landing experience
- **Feature Showcase**: Interactive grid displaying all capabilities
- **Role Selection**: Clear merchant vs. customer path selection
- **Quick Stats**: Performance metrics (speed, uptime, availability)
- **Tech Stack Display**: Technologies used with hover effects
- **Developer Guide**: Collapsible setup instructions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime (WebSocket subscriptions)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Audio**: Web Speech API + Web Audio API
- **QR**: qrcode + html5-qrcode
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Basic knowledge of Next.js and PostgreSQL

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
# Install dependencies
npm install
```

### 2. Configure Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your project URL and API keys
4. Go to **Project Settings** → **Database** and copy your connection string

### 3. Configure Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (for Prisma)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true&connection_limit=1

# Direct connection for migrations
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public
```

**Important Notes:**

- Use the **Transaction** connection string for `DATABASE_URL` (port 6543)
- Use the **Session** connection string for `DIRECT_URL` (port 5432)
- Never commit `.env.local` to version control

### 4. Run Database Migration

```bash
npx prisma migrate dev --name init
```

This creates the `Merchant` and `Transaction` tables in your Supabase database.

### 5. Enable Supabase Realtime & RLS

Open the Supabase SQL Editor and run the commands from `supabase-setup.md`:

```sql
-- Enable Realtime for Transaction table
ALTER PUBLICATION supabase_realtime ADD TABLE "Transaction";

-- Enable Row Level Security
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Merchant" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Merchants can view transactions
CREATE POLICY "Merchants can view their own transactions"
  ON "Transaction"
  FOR SELECT
  USING (true);

-- RLS Policy: Allow inserts
CREATE POLICY "Allow transaction inserts"
  ON "Transaction"
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Merchants can read their own data
CREATE POLICY "Merchants can view their own data"
  ON "Merchant"
  FOR SELECT
  USING (true);
```

### 6. Seed Test Data

```bash
npx prisma db seed
```

This creates 3 test merchants and displays their URLs:

```
✅ Created merchants:
─────────────────────────────────────────────────────────

1. Tindahan ni Aling Maria
   🔊 Soundbox URL: http://localhost:3000/merchant/[id]
   💳 Payment URL:  http://localhost:3000/pay/[id]

2. Mang Tomas Carinderia
   🔊 Soundbox URL: http://localhost:3000/merchant/[id]
   💳 Payment URL:  http://localhost:3000/pay/[id]

3. Sari-Sari Store
   🔊 Soundbox URL: http://localhost:3000/merchant/[id]
   💳 Payment URL:  http://localhost:3000/pay/[id]
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Application

1. **Open Merchant Soundbox**: Navigate to one of the Soundbox URLs from the seed output
2. **Activate Audio**: Click "Start Listening for Payments" (required for browser autoplay policy)
3. **Open Payment Page**: In a new tab/window, open the corresponding Payment URL
4. **Make a Payment**: Fill in customer name and amount, click "Pay Now"
5. **Hear the Alert**: The Soundbox tab will announce: "Payment received: [amount] pesos from [customer name]"

## 📁 Project Structure

```
ai-payment-soundbox/
├── app/
│   ├── page.tsx                              # Landing page (animated portal)
│   ├── layout.tsx                            # Root layout with Inter font
│   ├── globals.css                           # Tailwind v4 + theme config
│   ├── merchant/[id]/
│   │   └── page.tsx                          # Merchant soundbox (desktop UI)
│   ├── wallet/
│   │   ├── page.tsx                          # Customer wallet dashboard
│   │   └── qr/page.tsx                       # QR scanner page
│   ├── pay/[merchantId]/
│   │   └── page.tsx                          # Payment form (legacy)
│   ├── inbox/page.tsx                        # Inbox placeholder
│   ├── transactions/page.tsx                 # Transactions placeholder
│   ├── profile/page.tsx                      # Profile placeholder
│   └── api/
│       └── merchants/list/route.ts           # GET all merchants API
├── components/
│   ├── merchant/
│   │   ├── MerchantSwitcher.tsx              # Merchant dropdown selector
│   │   ├── QuickStatsCards.tsx               # Revenue/transaction stats
│   │   ├── QRCodeSection.tsx                 # QR display with actions
│   │   ├── TransactionList.tsx               # Animated transaction list
│   │   └── AudioSettingsDrawer.tsx           # Voice/sound settings panel
│   └── wallet/
│       ├── UserSwitcher.tsx                  # User profile switcher
│       └── BottomNavigation.tsx              # Mobile bottom nav
├── lib/
│   ├── prisma.ts                             # Prisma client (server-side)
│   ├── supabase.ts                           # Supabase client (client-side)
│   ├── qrcode.ts                             # QR generation utilities
│   ├── sounds.ts                             # Sound effect generators
│   ├── voice-presets.ts                      # TTS presets & templates
│   ├── wallet-users.ts                       # Demo user data
│   └── merchant-utils.ts                     # Stats & formatting utilities
├── prisma/
│   ├── schema.prisma                         # Database schema
│   ├── seed.ts                               # Seed script
│   └── migrations/                           # Migration history
├── public/                                   # Static assets
├── .env.local                                # Environment variables (DO NOT COMMIT)
├── supabase-setup.md                         # SQL commands for Supabase
├── prompts.md                                # Development prompt history
└── README.md                                 # This file
```

## 🏗️ Architecture

### Hybrid Database Strategy

| Action                   | Tool                       | Reason                                  |
| ------------------------ | -------------------------- | --------------------------------------- |
| **Insert Transaction**   | Prisma (Server Action)     | Trusted writes, type-safe, bypasses RLS |
| **Subscribe to Changes** | Supabase Client            | Realtime support, RLS enforced          |
| **Query Merchants**      | Either (context-dependent) | Server: Prisma, Client: Supabase        |

### Key Design Decisions

1. **Hybrid Prisma/Supabase**: Leverages Prisma's type safety for writes and Supabase's realtime capabilities for subscriptions
2. **RLS Defense-in-Depth**: Enabled even though Prisma bypasses it (protects against anon key misuse)
3. **Audio Context Initialization**: User gesture (button click) required to prime `speechSynthesis` API
4. **Single COMPLETED Status**: MVP simplicity—all transactions are immediately completed
5. **Seed Data**: 3 Filipino-themed merchants for immediate local testing

## 🔐 Security Considerations

### Current (MVP)

- RLS enabled but permissive (allows all reads for testing)
- Server-side uses service role key (bypasses RLS)
- Client-side uses anon key (respects RLS)

### Production Recommendations

- Implement Supabase Auth for merchant authentication
- Tighten RLS policies to filter by authenticated merchant ID
- Add server-side validation for transaction amounts
- Implement rate limiting on payment endpoint
- Add CSRF protection

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
4. Deploy

### Post-Deployment

- Run migrations: Use Vercel CLI or Supabase migration history
- Run seed script: `npx prisma db seed` locally (connects to production DB)
- Verify Supabase Realtime is enabled

## 🐛 Troubleshooting

### Audio Not Working

- **Issue**: No TTS announcements
- **Solution**: Click "Start Listening" button (browser autoplay policy requires user gesture)

### Realtime Not Receiving Events

- **Issue**: Payments don't trigger soundbox
- **Solutions**:
  1. Verify `ALTER PUBLICATION supabase_realtime ADD TABLE "Transaction"` was run
  2. Check browser console for subscription errors
  3. Confirm environment variables are correct
  4. Check Supabase dashboard → Database → Replication

### Migration Errors

- **Issue**: `npx prisma migrate dev` fails
- **Solutions**:
  1. Use `DIRECT_URL` (port 5432) not `DATABASE_URL` (port 6543)
  2. Check database credentials
  3. Ensure Supabase project is active

### Prisma Client Generation Issues

- **Issue**: `@prisma/client` import errors
- **Solution**: Run `npx prisma generate`

## 📚 Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 📝 Development Notes

See `prompts.md` for the full development prompt history and architectural decisions.

## 🎯 Pages & Routes

### Public Pages

- `/` - Landing page with feature showcase and role selection

### Merchant Routes (Desktop)

- `/merchant/[id]` - Merchant soundbox dashboard
- `/api/merchants/list` - API endpoint for merchant list

### Customer Routes (Mobile)

- `/wallet` - Wallet dashboard with balance and actions
- `/wallet/qr` - QR code scanner for payments
- `/pay/[merchantId]` - Direct payment form (legacy)
- `/inbox` - Inbox (placeholder)
- `/transactions` - Transaction history (placeholder)
- `/profile` - User profile (placeholder)

## 🎯 Roadmap

### ✅ Completed Features

- [x] Instant real-time payment notifications
- [x] Text-to-speech with multi-language support
- [x] Voice customization (6 presets + custom)
- [x] Sound effects (3 types)
- [x] QR code generation and scanning
- [x] Multi-merchant switching
- [x] Live analytics dashboard
- [x] Customer wallet interface
- [x] User switching in wallet
- [x] Professional desktop merchant UI
- [x] Mobile-optimized wallet UI
- [x] Animated landing page
- [x] Transaction history with animations

### 🚀 Future Enhancements

- [ ] Merchant authentication (Supabase Auth)
- [ ] Transaction filtering and search
- [ ] Multiple payment statuses (PENDING, FAILED, REFUNDED)
- [ ] Real payment gateway integration (Stripe, PayMongo)
- [ ] Email/SMS notifications
- [ ] Export transaction reports (CSV, PDF)
- [ ] Webhook support for integrations
- [ ] Dark mode support
- [ ] Multi-currency support
- [ ] Advanced analytics (charts, trends)
- [ ] Merchant settings persistence
- [ ] Customer transaction receipts
- [ ] Push notifications

## 📄 License

This is an MVP project for demonstration purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Built with ❤️ using Next.js 15, Prisma, and Supabase**
