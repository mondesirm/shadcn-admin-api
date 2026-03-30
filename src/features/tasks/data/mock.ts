import { faker } from '@faker-js/faker'
import { labels, statuses, priorities } from './items'
import { type Task } from './schema'

faker.seed(12345)

export const tasks = faker.helpers.multiple<Task>(
  (_, i) => ({
    id: i + 1,
    title: faker.lorem.sentence(),
    label: faker.helpers.arrayElement(labels.map((_) => _.value)),
    status: faker.helpers.arrayElement(statuses.map((_) => _.value)),
    priority: faker.helpers.arrayElement(priorities.map((_) => _.value)),
    dueDate: faker.date.future(),
    assignee: faker.person.fullName(),
    description: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),
  { count: 100 }
)
