# Payment Soundbox MVP 🔊

Real-time payment notifications with text-to-speech for merchants. Built with Next.js 15, Prisma, and Supabase Realtime.

## 🎯 Features

- **Instant Payment Notifications**: Merchants receive real-time audio alerts when customers make payments
- **Text-to-Speech Announcements**: Automatic voice announcements for payment amount and customer name
- **Mock Customer Wallet**: Simple payment interface for testing
- **Hybrid Database Strategy**: Prisma for server-side writes, Supabase for client-side realtime subscriptions
- **Row Level Security**: Defense-in-depth security with RLS policies

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime
- **Styling**: Tailwind CSS
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
│   ├── merchant/[id]/
│   │   └── page.tsx          # Merchant soundbox (realtime + TTS)
│   └── pay/[merchantId]/
│       └── page.tsx           # Customer payment form
├── lib/
│   ├── prisma.ts              # Prisma client (server-side)
│   └── supabase.ts            # Supabase client (client-side)
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── .env.local                 # Environment variables (DO NOT COMMIT)
├── supabase-setup.md          # SQL commands for Supabase
└── README.md
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

## 🎯 Roadmap

### Future Enhancements

- [ ] Merchant authentication (Supabase Auth)
- [ ] Transaction history with pagination
- [ ] TTS voice customization (voice, rate, pitch)
- [ ] Volume control
- [ ] Multiple payment statuses (PENDING, FAILED)
- [ ] Real payment gateway integration
- [ ] Mobile-responsive design improvements
- [ ] Analytics dashboard
- [ ] Export transaction reports

## 📄 License

This is an MVP project for demonstration purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

---

**Built with ❤️ using Next.js 15, Prisma, and Supabase**
