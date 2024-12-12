import { dev } from '$app/environment'
import { JWT_SECRET } from '$env/static/private'
import { generateJWT, hashPassword } from '$lib/crypto'
import { registerSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'
import { usernameUnique } from '$lib/server/validations'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await parseForm(registerSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { username, name, password } = formData
    const errors = await usernameUnique({ username })
    if (errors) {
      return fail(400, errors)
    }

    try {
      const id = nanoid(12)
      const newUserResult = await client.execute(
        sql`
          INSERT INTO user (id, username, name, password) 
            VALUES (${id}, ${username}, ${name}, ${await hashPassword(password)})
        `,
      )
      if (newUserResult.rowsAffected !== 1) {
        return fail(500, {
          error: { all: 'Could not register new user' },
        })
      }

      const token = await generateJWT({ userId: id }, JWT_SECRET)

      cookies.set('auth', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: !dev,
        maxAge: 60 * 60 * 24 * 7,
      })
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, { error: { all: 'Could not register new user' } })
    }
  },
}
