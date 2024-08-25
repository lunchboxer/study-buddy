import { hashPassword } from '$lib/crypto'
import { client, sql } from '$lib/data'
import { usernameUnique } from '$lib/data/validations'
import { userCreateSchema } from '$lib/schema'
import { isAdminOrError, isAdminOrFail, parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export const load = async ({ locals }) => {
  await isAdminOrError(locals.user.id)
  const result = await client.execute(
    sql`SELECT * FROM user ORDER BY username;`,
  )
  const usersResult = result?.rows || []
  const users = usersResult.map(user => {
    const { password, ...safeUser } = user
    return safeUser
  })
  return { users }
}

export const actions = {
  create: async ({ request, locals }) => {
    await isAdminOrFail(locals.user.id)
    const formData = await parseForm(userCreateSchema, request)
    const { username, name, password, email } = formData
    const errors = await usernameUnique({ username })
    if (errors) {
      return fail(400, errors)
    }
    const id = nanoid(12)
    const query = sql`
      INSERT INTO user (id, username, name, email, password) 
      VALUES (${id}, ${username}, ${name}, ${email}, ${await hashPassword(password)})
    `
    const newUserResult = await client.execute(query)
    if (newUserResult.rowsAffected !== 1) {
      return fail(500, { error: { all: 'Could not create new user' } })
    }
  },
}
