import { taskSchema } from '@/features/tasks/data/schema.js'
import * as z from '../../../lib/zod.js'
import { roles, statuses } from './enums.js'

export const userSchema = z.db.table(
  {
    firstName: z.db.text().max(100),
    lastName: z.db.text().max(100),
    username: z.db.text().max(100),
    email: z.email(),
    phoneNumber: z.e164().optional(),
    role: z.db.enum(roles).default('cashier'),
    status: z.db.enum(statuses).default('inactive'),
    get tasks() {
      return z.lazy(() => taskSchema.array()).optional()
    },
  },
  { primaryKey: 'uuid', softDelete: true }
)

export const userFormSchema = z.form(userSchema)
export const userBulkSchema = z.bulk(userSchema)

export type User = z.infer<typeof userSchema>
export type UserForm = z.infer<typeof userFormSchema>

export type UserBulk = {
  [K in keyof typeof userBulkSchema]: z.infer<(typeof userBulkSchema)[K]>
}
