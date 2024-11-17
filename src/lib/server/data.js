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

export const sqlBatch = input => {
  const statements = input.sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)

  let currentArgumentIndex = 0
  const batch = statements.map(stmt => {
    const parameterCount = (stmt.match(/\?/g) || []).length

    const statementArguments = input.args.slice(
      currentArgumentIndex,
      currentArgumentIndex + parameterCount,
    )

    currentArgumentIndex += parameterCount

    return {
      sql: `${stmt};`,
      args: statementArguments,
    }
  })

  if (currentArgumentIndex !== input.args.length) {
    throw new Error(
      `Mismatch between number of parameters and arguments. Used ${currentArgumentIndex} parameters but got ${input.args.length} arguments.`,
    )
  }

  return batch
}

export const executeBatch = async input => {
  const batch = sqlBatch(input)
  return await client.batch(batch)
}
