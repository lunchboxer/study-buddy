import { dev } from '$app/environment'
import { userRoleSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'
import { error, json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const data = await parsePost(userRoleSchema, request)
  if (data.errors) {
    error(400, { errors: data.errors })
  }
  try {
    const roleUserDeleteResult = await client.execute(
      sql`DELETE from user_role WHERE user_id = ${data.user_id} AND role_id = ${data.role_id};`,
    )
    if (roleUserDeleteResult.rowsAffected === 0) {
      error(500, 'Role was not removed from user.')
    }
    return json({ success: true })
  } catch (error_) {
    dev && console.error(error_)
    error(500, 'A server error occurred when removing role from user.')
  }
}
