import { client, sql } from '$lib/server/data'
import { roleNameUnique } from '$lib/server/validations'
import { roleCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
  const result = await client.execute(sql`SELECT * FROM role ORDER BY name;`)
  return { roles: result?.rows || [] }
}

export const actions = {
  // TODO: add validation for user is admin
  create: ({ request }) =>
    addAction(request, 'role', roleCreateSchema, roleNameUnique),
}
