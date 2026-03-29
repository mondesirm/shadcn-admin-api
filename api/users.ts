import prisma from '../prisma/index.js'
import {
  userSchema,
  userBulkSchema,
} from '../src/features/users/data/schema.js'
import { json } from './_lib/json.js'

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')

  const users = await prisma.user.findMany(id ? { where: { id } } : undefined)

  const { success, error, data } = userSchema.array().safeParse(users)
  if (!success) return json({ error }, { status: 500 })

  return json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const users = Array.isArray(body) ? body : [body]

  const { success, error, data } = userBulkSchema.create.safeParse(users)
  if (!success) return json({ error }, { status: 400 })

  const created = await prisma.user.createMany({ data })
  return json(created)
}

export async function PUT(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  const body = Object.assign({}, await req.json(), id && { ids: [id] })

  const { success, error, data } = userBulkSchema.update.safeParse(body)
  if (!success) return json({ error }, { status: 400 })

  const { ids, ...rest } = data

  const updated = await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: rest,
  })
  return json(updated)
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  const body = id ? [id] : await req.json()

  const { success, error, data } = userBulkSchema.delete.safeParse(body)
  if (!success) return json({ error }, { status: 400 })

  const deleted = await prisma.user.deleteMany({ where: { id: { in: data } } })
  return json(deleted)
}
