import prisma from '../../prisma/index.js'
import { taskSchema } from '../../src/features/tasks/data/schema.js'
import { json } from '../_lib/json.js'

export async function GET(req: Request) {
  const id = Number(new URL(req.url).searchParams.get('id'))

  const { success, error } = taskSchema.shape.id.safeParse(id)
  if (!success) return json({ error }, { status: 400 })

  const found = await prisma.task.findUnique({ where: { id } })
  if (!found) return json({ error: 'Not Found' }, { status: 404 })

  return json(found)
}

export async function PUT(req: Request) {
  const id = Number(new URL(req.url).searchParams.get('id'))
  const body = Object.assign({}, await req.json(), { id })

  const { success, error, data } = taskSchema.partial().safeParse(body)
  if (!success) return json({ error }, { status: 400 })

  const found = await prisma.task.findUnique({ where: { id } })
  if (!found) return json({ error: 'Not Found' }, { status: 404 })

  const updated = await prisma.task.update({ where: { id }, data })
  return json(updated)
}

export async function DELETE(req: Request) {
  const id = Number(new URL(req.url).searchParams.get('id'))

  const { success, error } = taskSchema.shape.id.safeParse(id)
  if (!success) return json({ error }, { status: 400 })

  const found = await prisma.task.findUnique({ where: { id } })
  if (!found) return json({ error: 'Not Found' }, { status: 404 })

  const deleted = await prisma.task.delete({ where: { id } })
  return json(deleted)
}
