import { hashPassword } from '$lib/crypto'
import { client, sql } from '$lib/server/data'
import { usernameUnique } from '$lib/server/validations'
import { userCreateSchema } from '$lib/schema'
import { isAdminOrError, isAdminOrFail, parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export const load = async ({ locals }) => {
  await isAdminOrError(locals.user.id)
  const result = await client.execute(sql`
    SELECT
      u.id,
      u.username,
      u.name,
      u.email,
      u.active_school_year,
      u.created,
      GROUP_CONCAT (r.name, ', ') AS roles
    FROM
      user u
      LEFT JOIN user_role ur ON u.id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.id
    WHERE
      u.id NOT IN (
        SELECT
          ur.user_id
        FROM
          user_role ur
          JOIN role r ON ur.role_id = r.id
        WHERE
          r.name = 'student'
      )
    GROUP BY
      u.id
    ORDER BY
      u.username;
  `)
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
