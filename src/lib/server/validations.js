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
  const query = `SELECT id FROM ${tableName} WHERE ${columnName} = ?`
  const arguments_ = [value]

  // Execute the query
  const existingRecords = await client.execute({ sql: query, args: arguments_ })

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

export const subjectNameUnique = async ({ name, id }) =>
  checkUniqueness({
    tableName: 'subject',
    columnName: 'name',
    value: name,
    id,
    errorMessage: 'Name must be unique',
  })

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

export const wordTagNameUnique = async ({ name, id }) =>
  checkUniqueness({
    tableName: 'word_tag',
    columnName: 'name',
    value: name,
    id,
    errorMessage: `A tag named "${name}" already exists`,
  })

export const wordWordUnique = async ({ word, id }) =>
  checkUniqueness({
    tableName: 'word',
    columnName: 'word',
    value: word,
    id,
    errorMessage: `A word "${word}" already exists`,
  })

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
