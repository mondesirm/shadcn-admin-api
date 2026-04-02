import { faker } from '@faker-js/faker'
import { roles, statuses } from './enums'
import { type User } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const users = faker.helpers.multiple<User>(
  () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      username: faker.internet.username({ firstName, lastName }).toLowerCase(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phoneNumber: faker.phone.number({ style: 'international' }),
      role: faker.helpers.arrayElement(roles.map((_) => _.value)),
      status: faker.helpers.arrayElement(statuses.map((_) => _.value)),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: faker.helpers.maybe(() => faker.date.recent()),
    }
  },
  { count: 100 }
)
