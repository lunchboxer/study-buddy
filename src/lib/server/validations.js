// validations.js  extra validation functions
// take formData object
// return the error object { errors: { field: 'error message' } }
import { client, sql } from '$lib/server/data'

const checkUniqueness = async ({
  tableName,
  columnName,
  value,
  id,
  errorMessage,
}) => {
  // Construct the base query
  const query = sql`SELECT id FROM ${sql.raw(tableName)} WHERE ${sql.raw(columnName)} = ${value}`

  // Execute the query
  const existingRecords = await client.execute(query)

  // If records exist, check for uniqueness
  if (
    existingRecords?.rows?.length > 0 && // If no ID provided or ID doesn't match existing record, it's not unique
    (id === null || id !== existingRecords?.rows?.[0].id)
  ) {
    // Use custom error message or generate a default one
    const defaultErrorMessage = `A ${columnName} with this value already exists`
    return {
      errors: {
        [columnName]: errorMessage || defaultErrorMessage,
      },
    }
  }
}

export const subjectNameUnique = async ({ name }) => {
  const sameNameSubjects = await client.execute(
    sql`SELECT * FROM subject WHERE name = ${name};`,
  )
  if (sameNameSubjects?.rows?.length > 0) {
    return { errors: { name: 'Name must be unique' } }
  }
}

export const usernameUnique = async ({ username, id }) =>
  checkUniqueness({
    tableName: 'user',
    columnName: 'username',
    value: username,
    id,
    errorMessage: 'That username is already taken',
  })

export const roleNameUnique = async ({ name, id }) =>
  checkUniqueness({
    tableName: 'role',
    columnName: 'name',
    value: name,
    id,
    errorMessage: `A role named "${name}" already exists`,
  })

export const wordTagNameUnique = async ({ name, id }) => {
  const sameNameWordTags = await client.execute(
    sql`SELECT * FROM word_tag WHERE name = ${name};`,
  )
  if (
    sameNameWordTags?.rows?.length > 0 &&
    id !== sameNameWordTags?.rows?.[0].id
  ) {
    return { errors: { name: `A tag named "${name}" already exists` } }
  }
}

export const wordWordUnique = async ({ word, id }) => {
  const sameWordWords = await client.execute(
    sql`SELECT id FROM word WHERE word = ${word};`,
  )
  if (sameWordWords?.rows?.length > 0 && id !== sameWordWords?.rows?.[0].id) {
    return { errors: { name: `A word "${word}" already exists` } }
  }
}

export const mustStartBeforeEnd = ({ start_date, end_date }) => {
  if (new Date(start_date) > new Date(end_date)) {
    return {
      errors: {
        start_date: 'Start date must be before end date.',
        end_date: 'End date must be after start date.',
      },
    }
  }
}
