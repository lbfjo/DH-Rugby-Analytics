require('dotenv').config();

console.log('Checking env vars...');
console.log('POSTGRES_PRISMA_URL exists:', !!process.env.POSTGRES_PRISMA_URL);
console.log('POSTGRES_URL_NON_POOLING exists:', !!process.env.POSTGRES_URL_NON_POOLING);
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);

if (process.env.POSTGRES_PRISMA_URL) console.log('POSTGRES_PRISMA_URL starts with:', process.env.POSTGRES_PRISMA_URL.substring(0, 10));
