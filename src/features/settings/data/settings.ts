import { faker } from '@faker-js/faker'
import { languages } from '@/config/languages'
import { sidebar } from './items'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const profiles = faker.helpers.multiple(
  (_) => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    bio: faker.lorem.paragraph(),
    urls: faker.helpers.multiple(() => ({ value: faker.internet.url() })),
  }),
  { count: 100 }
)

export const account = {
  name: faker.person.fullName(),
  dob: faker.date.past({ years: 30 }),
  language: faker.helpers.arrayElement(languages.map((_) => _.value)),
  emails: faker.helpers.multiple(() => ({ value: faker.internet.email() })),
}

export const notifications = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export const display = {
  sidebar: faker.helpers.arrayElements(sidebar.map((_) => _.value)),
}
