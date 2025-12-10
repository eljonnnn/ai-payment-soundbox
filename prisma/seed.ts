import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Clear existing data (optional - comment out for production)
  await prisma.transaction.deleteMany()
  await prisma.merchant.deleteMany()
  console.log('✓ Cleared existing data')
  
  const merchants = await Promise.all([
    prisma.merchant.create({
      data: {
        name: 'Tindahan ni Aling Maria',
      }
    }),
    prisma.merchant.create({
      data: {
        name: 'Mang Tomas Carinderia',
      }
    }),
    prisma.merchant.create({
      data: {
        name: 'Sari-Sari Store',
      }
    })
  ])
  
  console.log('\n✅ Created merchants:')
  console.log('─────────────────────────────────────────────────────────')
  
  merchants.forEach((merchant, index) => {
    console.log(`\n${index + 1}. ${merchant.name}`)
    console.log(`   ID: ${merchant.id}`)
    console.log(`   🔊 Soundbox URL: http://localhost:3000/merchant/${merchant.id}`)
    console.log(`   💳 Payment URL:  http://localhost:3000/pay/${merchant.id}`)
  })
  
  console.log('\n─────────────────────────────────────────────────────────')
  console.log('✅ Seeding completed successfully!')
  console.log('\n📝 Next steps:')
  console.log('   1. Configure your .env.local with Supabase credentials')
  console.log('   2. Run: npx prisma migrate dev --name init')
  console.log('   3. Run SQL commands from supabase-setup.md in Supabase SQL Editor')
  console.log('   4. Start dev server: npm run dev')
  console.log('   5. Open a Soundbox URL in one tab')
  console.log('   6. Open a Payment URL in another tab and make a payment')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
