// validations.js  extra validation functions
// take formData object
// return the error object { errors: { field: 'error message' } }
import { client, sql } from '$lib/server/data'

export const subjectNameUnique = async ({ name }) => {
  const sameNameSubjects = await client.execute(
    sql`SELECT * FROM subject WHERE name = ${name};`,
  )
  if (sameNameSubjects?.rows?.length > 0) {
    return { errors: { name: 'Name must be unique' } }
  }
}

export const usernameUnique = async ({ username, id }) => {
  const sameUsernameUsers = await client.execute(
    sql`SELECT * FROM user WHERE username = ${username};`,
  )
  if (
    sameUsernameUsers?.rows?.length > 0 &&
    id !== sameUsernameUsers?.rows?.[0].id
  ) {
    return { errors: { username: 'That username is already taken' } }
  }
}

export const roleNameUnique = async ({ name, id }) => {
  const sameNameRoles = await client.execute(
    sql`SELECT * FROM role WHERE name = ${name};`,
  )
  if (sameNameRoles?.rows?.length > 0 && id !== sameNameRoles?.rows?.[0].id) {
    return { errors: { name: `A role named "${name}" already exists` } }
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
