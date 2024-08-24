import { client, sql } from '$lib/data'
import { userCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
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
  create: ({ request }) => addAction(request, 'user', userCreateSchema),
}
