import * as z from '../../../lib/zod.js'
import { labels, priorities, statuses } from './items.js'

export const Model = z.db.table({
  title: z.db.text().max(100),
  label: z.db.enum(labels),
  status: z.db.enum(statuses),
  priority: z.db.enum(priorities),
  dueDate: z.db.date.future(),
  assignee: z.db.text().optional(),
  description: z.db.text().max(300).optional(),
})

export const Form = z.form(Model)
export const Bulk = z.bulk(Model)

export const Params = z.object({
  page: z.int().optional().catch(1),
  pageSize: z.int().optional().catch(10),
  filter: z.string().optional().catch(''),
  label: Model.shape.label.array().optional().catch([]),
  status: Model.shape.status.array().optional().catch([]),
  priority: Model.shape.priority.array().optional().catch([]),
})

// export const Import = z.object({
//   file: z.file().mime('text/csv').max(5_000_000),
// })

export const Import = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files[0]?.type === 'text/csv')
    .refine((files) => files[0]?.size <= 5_000_000),
})

export const Task = Object.assign(Model, { Form, Bulk, Params, Import })

export type Task = z.infer<typeof Task>

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Task {
  export type Model = z.infer<typeof Model>
  export type Form = z.infer<typeof Form>
  export type Bulk = { [K in keyof typeof Bulk]: z.infer<(typeof Bulk)[K]> }
  export type Params = z.infer<typeof Params>
  export type Import = z.infer<typeof Import>
}
