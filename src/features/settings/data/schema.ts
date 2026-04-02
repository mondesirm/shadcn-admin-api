import { subYears } from 'date-fns'
import * as z from '@/lib/zod'
import { fonts } from '@/config/fonts'
import { languages } from '@/config/languages'
import { modes } from '@/config/themes'
import { notifications } from './items'

export const ProfileForm = z.object({
  username: z.db.text().min(2).max(255),
  email: z.email(),
  bio: z.string().max(160).min(4),
  urls: z.object({ value: z.url() }).array(),
})

export const AccountForm = z.object({
  name: z.db.text().min(2).max(30),
  dob: z.db.date.past(subYears(new Date(), 18)),
  language: z.db.enum(languages),
  emails: z.object({ value: z.email() }).array(),
})

export const AppearanceForm = z.object({
  font: z.db.enum(fonts),
  mode: z.db.enum(modes),
})

export const NotificationsForm = z.object({
  type: z.db.enum(notifications),
  mobile: z.boolean().default(false),
  communication_emails: z.boolean().default(false),
  social_emails: z.boolean().default(false),
  marketing_emails: z.boolean().default(false),
  security_emails: z.boolean().default(true),
})

export const DisplayForm = z.object({ sidebar: z.db.text().array() })

export type ProfileForm = z.infer<typeof ProfileForm>
export type AccountForm = z.infer<typeof AccountForm>
export type AppearanceForm = z.infer<typeof AppearanceForm>
export type NotificationsForm = z.infer<typeof NotificationsForm>
export type DisplayForm = z.infer<typeof DisplayForm>
