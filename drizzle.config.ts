import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

const envFile = process.env.DB_ENV_FILE
const result = config({ path: envFile ?? ['.env.local', '.env'], quiet: true })

if (envFile && result.error) {
  throw new Error(`Unable to load DB_ENV_FILE: ${envFile}`)
}

if (!process.env.DATABASE_URL?.trim()) {
  throw new Error('DATABASE_URL is required for Drizzle commands')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
