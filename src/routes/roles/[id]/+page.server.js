import { dev } from '$app/environment'
import { client, sql } from '$lib/data'
import { roleNameUnique } from '$lib/data/validations'
import { roleUpdateSchema, roleAddUserSchema } from '$lib/schema'
import { deleteAction, updateAction, parseForm } from '$lib/server-utils'
import { error, fail } from '@sveltejs/kit'

export async function load({ params }) {
  const roleResult = await client.execute(
    sql`
      SELECT 
          r.id AS id,
          r.name AS name,
          json_group_array(
              json_object(
                  'id', u.id,
                  'username', u.username,
                  'name', u.name
              )
          ) AS users
      FROM 
          role r
      LEFT JOIN 
          user_role ur ON r.id = ur.role_id
      LEFT JOIN 
          user u ON ur.user_id = u.id
      WHERE 
          r.id = ${params.id};
      GROUP BY 
          r.id, r.name
    `,
  )
  if (!roleResult?.rows?.[0]) {
    throw error(404, 'Role not found.')
  }
  const otherUsers = await client.execute(
    sql`
      SELECT 
        u.id AS id,
        u.username AS username,
        u.name AS name
      FROM 
        user u
      WHERE 
        u.id NOT IN (SELECT user_id FROM user_role WHERE role_id = ${params.id})
      ORDER BY 
        u.username
    `,
  )
  const role = roleResult?.rows?.[0]
  role.users = JSON.parse(role.users)
  return { role, otherUsers: otherUsers?.rows || [] }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'user'),
  update: ({ request }) =>
    updateAction(request, 'role', roleUpdateSchema, roleNameUnique),
  addUser: async ({ request }) => {
    const formData = await parseForm(roleAddUserSchema, request)
    const existingUserResult = await client.execute(
      sql`SELECT id FROM user WHERE id = ${formData.user_id};`,
    )
    if (existingUserResult?.rows?.length === 0) {
      return fail(404, { error: { all: 'User not found' } })
    }
    const existingRoleResult = await client.execute(
      sql`SELECT id FROM role WHERE id = ${formData.role_id};`,
    )
    if (existingRoleResult?.rows?.length === 0) {
      return fail(404, { error: { all: 'Role not found' } })
    }
    // check if user already has role
    const existingUserRoleResult = await client.execute(
      sql`SELECT role_id FROM user_role WHERE user_id = ${formData.user_id} AND role_id = ${formData.role_id};`,
    )
    if (existingUserRoleResult?.rows?.length > 0) {
      return fail(400, { error: { all: 'User already has role' } })
    }
    try {
      const result = await client.execute(
        sql`
          INSERT INTO user_role (user_id, role_id) 
          VALUES (${formData.user_id}, ${formData.role_id});
        `,
      )
      if (result.rowsAffected === 0) {
        return fail(500, { error: { all: 'Could not add user to role' } })
      }
    } catch (error) {
      dev && console.error(error)
      return fail(500, { error: { all: 'Could not add user to role' } })
    }
  },
}
