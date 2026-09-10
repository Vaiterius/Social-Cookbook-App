import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'
import * as relations from './relations.ts'

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...schema, ...relations },
})
