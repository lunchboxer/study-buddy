import { dev } from '$app/environment'
import { hashPassword } from '$lib/crypto'
import { client, sql } from '$lib/data'
import { usernameUnique } from '$lib/data/validations'
import { userUpdatePasswordSchema, userUpdateSchema } from '$lib/schema'
import { deleteAction, parseForm } from '$lib/server-utils'
import { error, fail } from '@sveltejs/kit'

export async function load({ params }) {
  const userResult = await client.execute(
    sql`SELECT * FROM user WHERE id = ${params.id};`,
  )
  if (!userResult?.rows?.[0]) {
    throw error(404, 'User not found.')
  }
  const unsafeUser = userResult?.rows?.[0]
  const { password, ...user } = unsafeUser
  return { user }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'user'),

  updatePassword: async ({ request }) => {
    const formData = await parseForm(userUpdatePasswordSchema, request)
    const hashedPassword = await hashPassword(formData.password)

    try {
      const query = sql`
        UPDATE user 
        SET password = ${hashedPassword} 
        WHERE id = ${formData.id};
      `
      const result = await client.execute(query)
      if (result.rowsAffected === 0) {
        return fail(500, { error: { all: 'Could not update user password.' } })
      }
    } catch (error_) {
      dev && console.error(error_)
      return fail(500, { error: { all: 'Could not update user password.' } })
    }
  },

  update: async ({ request, params }) => {
    const formData = await parseForm(userUpdateSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { id } = params

    try {
      const existingUserResult = await client.execute(
        sql`SELECT id FROM user WHERE id = ${id};`,
      )
      if (existingUserResult?.rows?.length === 0) {
        return fail(404, { error: { all: 'User not found' } })
      }
      const errors = await usernameUnique({ username: formData.username, id })
      if (errors) {
        return fail(400, errors)
      }
      const updatedUserResult = await client.execute(
        sql`
          UPDATE user 
          SET username = ${formData.username}, name = ${formData.name}, email = ${formData.email} 
          WHERE id = ${id};
        `,
      )
      if (updatedUserResult.rowsAffected === 0) {
        return fail(500, { error: { all: 'Could not update user' } })
      }
    } catch (error_) {
      dev && console.error(error_)
      return fail(500, { error: { all: 'Could not update user' } })
    }
    return { success: true }
  },
}
