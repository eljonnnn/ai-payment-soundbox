# Supabase Realtime Setup SQL

Run these SQL commands in your Supabase SQL Editor after running Prisma migrations.

## Enable Realtime for Transaction Table

```sql
-- Enable Realtime for Transaction table
ALTER PUBLICATION supabase_realtime ADD TABLE "Transaction";
```

## Enable Row Level Security

```sql
-- Enable Row Level Security
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Merchant" ENABLE ROW LEVEL SECURITY;
```

## Create RLS Policies

```sql
-- RLS Policy: Merchants can only read their own transactions
CREATE POLICY "Merchants can view their own transactions"
  ON "Transaction"
  FOR SELECT
  USING (true); -- For MVP, allow all reads (tighten in production)

-- RLS Policy: Allow inserts from authenticated users (server-side)
CREATE POLICY "Allow transaction inserts"
  ON "Transaction"
  FOR INSERT
  WITH CHECK (true); -- Server-side bypasses RLS with service role key

-- RLS Policy: Merchants can read their own data
CREATE POLICY "Merchants can view their own data"
  ON "Merchant"
  FOR SELECT
  USING (true); -- For MVP, allow all reads
```

## Notes

- RLS is enabled for defense-in-depth security
- Prisma (server-side) uses service role key and bypasses RLS for writes
- Supabase client (client-side) enforces RLS for realtime subscriptions
- For production, tighten policies to filter by authenticated merchant ID
