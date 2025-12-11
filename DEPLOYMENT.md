# 🚀 Deployment Checklist

## ✅ Pre-Deployment Verification

All checks passed! Your application is ready for Vercel deployment.

### Build Status
- ✅ TypeScript compilation successful
- ✅ All ESLint rules passing
- ✅ Production build completed without errors
- ✅ Static optimization applied where possible

### Fixed Issues

1. **TypeScript Error: REALTIME_SUBSCRIBE_STATES**
   - Fixed incorrect enum value `"SUBSCRIPTION_ERROR"` → `REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR`
   - Added proper import from `@supabase/supabase-js`

2. **useEffect Dependencies**
   - Wrapped `speakPayment` function in `useCallback` hook
   - Added all dependencies to prevent stale closures

3. **ESLint Errors**
   - Fixed unescaped entities in JSX (quotes and apostrophes)
   - Removed unused `VoicePreset` type import
   - Added eslint-disable comment for Web Audio API fallback

## 📋 Deployment Steps for Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix TypeScript and ESLint errors for deployment"
git push origin main
```

### 2. Vercel Dashboard Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `eljonnnn/ai-payment-soundbox`
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ckdxojaiitjgtrbmajwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZHhvamFpaXRqZ3RyYm1handvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjkwMjYsImV4cCI6MjA4MDk0NTAyNn0.11Gc7WbQIQztk28Ie9Ifa5ZwK-Fbt1qXbtm1mCIbWLM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZHhvamFpaXRqZ3RyYm1handvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM2OTAyNiwiZXhwIjoyMDgwOTQ1MDI2fQ.5cDz8j9C-C3M6pWGKe3ymXFTIF-9OYKCw9r_CyBOjFA

# Database Connection (URL-encoded password: %40Earlxd14)
DATABASE_URL=postgresql://postgres.ckdxojaiitjgtrbmajwo:%40Earlxd14@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.ckdxojaiitjgtrbmajwo:%40Earlxd14@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**Important**: 
- Apply to: **Production, Preview, and Development**
- The `@` symbol in password is URL-encoded as `%40`

### 4. Deploy

Click **"Deploy"** button. Vercel will:
- Clone your repository
- Install dependencies
- Run `npm run build`
- Deploy to production

## 🔧 Post-Deployment Steps

### 1. Verify Database Setup

Ensure Supabase is properly configured:

```sql
-- Run in Supabase SQL Editor (already done, but verify):

-- Enable Realtime for Transaction table
ALTER PUBLICATION supabase_realtime ADD TABLE "Transaction";

-- Enable Row Level Security
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Merchant" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access" ON "Transaction"
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON "Transaction"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON "Merchant"
  FOR SELECT USING (true);
```

### 2. Seed Database (if needed)

From your local machine (connects to production):

```bash
npx prisma db seed
```

### 3. Test Deployment

1. Open your Vercel deployment URL (e.g., `https://ai-payment-soundbox.vercel.app`)
2. Navigate to a merchant soundbox: `/merchant/{merchantId}`
3. Open payment page in another tab: `/pay/{merchantId}`
4. Make a test payment
5. Verify:
   - ✅ Payment appears instantly in soundbox
   - ✅ Sound effect plays
   - ✅ TTS announcement works
   - ✅ QR code displays correctly
   - ✅ Voice presets and templates function

## 🎯 Vercel-Specific Considerations

### Build Settings
- **Node.js Version**: 20.x (Vercel default)
- **Package Manager**: npm (detected from package-lock.json)
- **Install Command**: `npm install`
- **Build Command**: `npm run build`

### Serverless Functions
Your API routes are automatically deployed as serverless functions:
- Server Actions in `/pay/[merchantId]/page.tsx`
- No additional configuration needed

### Edge Runtime
- Not using Edge Runtime (standard Node.js runtime)
- Prisma requires Node.js runtime for database connections

### Caching
- Static pages cached at edge
- Dynamic routes (`/merchant/[id]`, `/pay/[merchantId]`) rendered on-demand
- ISR not configured (real-time data updates)

## 🐛 Troubleshooting

### Build Failures

**Issue**: TypeScript compilation errors
- ✅ **Fixed**: All type errors resolved

**Issue**: ESLint warnings blocking build
- ✅ **Fixed**: All lint errors resolved

### Runtime Issues

**Issue**: Database connection timeout
- **Solution**: Verify `DATABASE_URL` uses port 6543 (pgbouncer)
- **Solution**: Check Supabase project is not paused

**Issue**: Realtime not working
- **Solution**: Verify `ALTER PUBLICATION` was executed
- **Solution**: Check Supabase Dashboard → Database → Replication

**Issue**: TTS not working
- **Solution**: Browser must support Web Speech API (Chrome, Edge, Safari)
- **Note**: Firefox has limited TTS support

### Environment Variables

**Issue**: "Missing environment variables"
- **Solution**: Ensure all vars are set in Vercel Dashboard
- **Solution**: Redeploy after adding/updating env vars

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: Track build history and status
- **Analytics**: View page performance and visitors
- **Logs**: Real-time function logs (Runtime Logs tab)

### Recommended Monitoring
- Set up Vercel Monitoring for performance tracking
- Enable Error Tracking in project settings
- Monitor Supabase Dashboard for database usage

## 🔄 Continuous Deployment

Automatic deployments triggered by:
- ✅ Push to `main` branch → Production deployment
- ✅ Push to other branches → Preview deployment
- ✅ Pull requests → Preview deployment with comment

## 📝 Notes

- Web Speech API and Web Audio API are browser-native (no server processing)
- QR code generation happens client-side (no server load)
- Prisma Client optimized for serverless with connection pooling
- Supabase Realtime uses WebSocket connections (handled by Supabase)

---

## ✨ You're Ready to Deploy!

All pre-deployment checks passed. Your Payment Soundbox MVP is production-ready.

**Next Step**: Push to GitHub and import to Vercel Dashboard.
