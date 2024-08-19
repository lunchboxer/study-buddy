import { json } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { JWT_SECRET } from '$env/static/private'
import { generateJWT, passwordMatches } from '$lib/crypto'
import { client, sql } from '$lib/data'
import { loginSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { error } from '@sveltejs/kit'

export async function POST({ cookies, request }) {
  const formData = await parsePost(loginSchema, request)
  if (formData.errors) {
    error(400, 'Invalid form data.')
  }

  const { username, password } = formData
  const result = await client.execute(
    sql`SELECT id, password FROM user WHERE username = ${username} LIMIT 1`,
  )
  const user = result.rows[0]

  if (!user) {
    error(400, 'Username not found.')
  }

  if (!(await passwordMatches(password, user.password))) {
    error(400, 'Invalid password.')
  }

  const token = await generateJWT({ userId: user.id }, JWT_SECRET)

  cookies.set('auth', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: !dev,
    maxAge: 60 * 60 * 24 * 7,
  })

  return new json({ success: true })
}
