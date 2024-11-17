import { dev } from '$app/environment'
import { JWT_SECRET } from '$env/static/private'
import { generateJWT, passwordMatches } from '$lib/crypto'
import { client, sql } from '$lib/server/data'
import { loginSchema, studentLoginSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { fail, redirect } from '@sveltejs/kit'

async function setCookie(cookies, userId) {
  const token = await generateJWT({ userId }, JWT_SECRET)

  cookies.set('auth', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: !dev,
    maxAge: 60 * 60 * 24 * 7,
  })
}
export async function load() {
  const studentQuery = sql`
    SELECT u.*
    FROM user u
    JOIN user_role ur ON u.id = ur.user_id
    JOIN role r ON ur.role_id = r.id
    WHERE r.name = 'student'
    ORDER BY u.name;
  `
  const result = await client.execute(studentQuery)
  const students = result?.rows || []
  return { students }
}

export const actions = {
  studentLogin: async ({ request, cookies }) => {
    const formData = await parseForm(studentLoginSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { studentId, password } = formData
    const result = await client.execute(
      sql`SELECT id, password FROM user WHERE id = ${studentId} LIMIT 1;`,
    )
    const user = result.rows[0]
    if (!user) {
      return fail(400, {
        ...formData,
        errors: { all: 'Student not found.' },
      })
    }
    if (password !== user.password) {
      return fail(400, {
        ...formData,
        errors: { all: 'Wrong password.' },
      })
    }

    await setCookie(cookies, user.id)

    throw redirect(303, '/s')
  },

  login: async ({ request, cookies }) => {
    const formData = await parseForm(loginSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { username, password } = formData
    const result = await client.execute(
      sql`SELECT id, password FROM user WHERE username = ${username} LIMIT 1`,
    )
    const user = result.rows[0]

    if (!user) {
      return fail(400, {
        ...formData,
        errors: { username: 'Username not found.' },
      })
    }
    if (!(await passwordMatches(password, user.password))) {
      return fail(400, {
        ...formData,
        errors: { password: 'Invalid password.' },
      })
    }

    await setCookie(cookies, user.id)

    return { success: true }
  },
}
