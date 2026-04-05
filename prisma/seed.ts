import { tasks as task } from '@/features/tasks/data/tasks'
import prisma from '.'

async function main() {
  const seeders = { task }

  await prisma.$transaction(
    Object.entries(seeders).map(([model, data]) => {
      // eslint-disable-next-line no-console
      console.log(`\x1b[32m🌱 ${model} x${data.length}\x1b[0m`)
      return prisma[model as keyof typeof seeders].createMany({
        data,
        skipDuplicates: true,
      })
    })
  )
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
