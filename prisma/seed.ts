import { tasks as task } from '@/features/tasks/data/tasks'
import { users as user } from '@/features/users/data/users'
import prisma from '.'

async function main() {
  const seeders = { user, task }

  await prisma.$transaction(
    Object.entries(seeders).map(([model, data]) => {
      // eslint-disable-next-line no-console
      console.log(`\x1b[32m🌱 ${model} x${data.length}\x1b[0m`)
      // @ts-expect-error Dynamic model access
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
