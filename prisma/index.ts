import { env } from '@/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'

declare global {
  var prisma: PrismaClient
}

// TODO connection pooling for serverless environments
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

export const prisma =
  globalThis.prisma ||
  new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async findMany({ query, args }) {
          args.orderBy ??= { updatedAt: 'desc' }
          return query(args)
        },
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
