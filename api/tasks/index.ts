import prisma from '../../prisma/index.js'
import {
  taskSchema,
  taskBulkSchema,
} from '../../src/features/tasks/data/schema.js'
import { json } from '../_lib/json.js'

export async function GET() {
  const tasks = await prisma.task.findMany()

  const { success, error, data } = taskSchema.array().safeParse(tasks)
  if (!success) return json({ error }, { status: 500 })

  return json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const tasks = Array.isArray(body) ? body : [body]

  const { success, error, data } = taskBulkSchema.create.safeParse(tasks)
  if (!success) return json({ error }, { status: 400 })

  const created = await prisma.task.createMany({ data })
  return json(created)
}

export async function PUT(req: Request) {
  const body = await req.json()

  const { success, error, data } = taskBulkSchema.update.safeParse(body)
  if (!success) return json({ error }, { status: 400 })

  const { ids, ...rest } = data

  const updated = await prisma.task.updateMany({
    where: { id: { in: ids } },
    data: rest,
  })
  return json(updated)
}

export async function DELETE(req: Request) {
  const body = await req.json()

  const { success, error, data } = taskBulkSchema.delete.safeParse(body)
  if (!success) return json({ error }, { status: 400 })

  const deleted = await prisma.task.deleteMany({ where: { id: { in: data } } })
  return json(deleted)
}
