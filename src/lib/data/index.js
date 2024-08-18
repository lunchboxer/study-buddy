import { dev } from '$app/environment'
import { DB_URL_DEV, TURSO_AUTH_TOKEN, TURSO_DB_URL } from '$env/static/private'
import { createClient } from '@libsql/client'

export const client = createClient({
  url: dev ? DB_URL_DEV : TURSO_DB_URL,
  authToken: TURSO_AUTH_TOKEN,
})

// make a parameterized query but let me write it as a string
export const sql = (strings, ...values) => ({
  sql: strings.reduce((prev, curr, i) => {
    const value = values[i] ? '?' : ''
    return prev + curr + value
  }, ''),
  args: values.filter(value => value !== undefined),
})
