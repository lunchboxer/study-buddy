import { client, sql } from '$lib/data'
import { usernameUnique } from '$lib/data/validations'
import { userCreateSchema } from '$lib/schema'
import { addAction, isAdminOrError } from '$lib/server-utils'

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
  // TODO: add validation for user is admin
  create: ({ request }) =>
    addAction(request, 'user', userCreateSchema, usernameUnique),
}
