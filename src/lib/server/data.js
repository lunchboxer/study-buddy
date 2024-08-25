import { dev } from '$app/environment'
import { DB_URL_DEV, TURSO_AUTH_TOKEN, TURSO_DB_URL } from '$env/static/private'
import { createClient } from '@libsql/client'

export const client = createClient({
  url: dev ? DB_URL_DEV : TURSO_DB_URL,
  authToken: TURSO_AUTH_TOKEN,
})

// make a parameterized query but let me write it as a string
export const sql = (strings, ...values) => {
  let sqlString = ''
  const arguments_ = []

  let index = 0
  for (const string of strings) {
    sqlString += string
    if (values[index] !== undefined) {
      sqlString += '?'
      arguments_.push(values[index])
    }
    index++
  }

  return {
    sql: sqlString,
    args: arguments_,
  }
}
