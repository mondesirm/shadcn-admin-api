import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { env } from './src/env'

export default defineConfig({
  schema: 'prisma/schema',
  datasource: { url: env.DATABASE_URL },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
