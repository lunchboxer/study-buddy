import { client, sql } from '$lib/data'
import { userCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
  const result = await client.execute(
    sql`SELECT * FROM user ORDER BY username;`,
  )
  return { users: result?.rows || [] }
}

export const actions = {
  create: async ({ request }) =>
    addAction(request, 'user', userCreateSchema),
}
