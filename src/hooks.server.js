import { dev } from '$app/environment'
import { JWT_SECRET } from '$env/static/private'
import { verifyAndDecodeJWT } from '$lib/crypto'
import { client, sql } from '$lib/data'
import { redirect } from '@sveltejs/kit'

const getUserFromToken = async token => {
  if (!token) {
    return
  }
  try {
    const { userId } = await verifyAndDecodeJWT(token, JWT_SECRET)
    if (!userId) {
      return
    }
    const result = await client.execute(
      sql`SELECT * FROM user WHERE id = ${userId} LIMIT 1`,
    )
    const user = result?.rows?.[0]
    if (!user) {
      return
    }
    const { password, ...authenticatedUser } = user
    return authenticatedUser
  } catch (error) {
    dev && console.error('getUserFromToken error', error)
  }
}

const routesNotProtected = new Set(['/about', '/login', '/logout', '/register'])

const redirectWithReturn = (event, redirectUrl) => {
  const newPath =
    event.url.pathname === '/'
      ? redirectUrl
      : `${redirectUrl}?returnTo=${event.url.pathname}`
  throw redirect(302, newPath)
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const authToken = event.cookies.get('auth')
  event.locals.user = await getUserFromToken(authToken)
  if (!(routesNotProtected.has(event.url.pathname) || event.locals.user)) {
    redirectWithReturn(event, '/login')
  } else if (
    !(
      routesNotProtected.has(event.url.pathname) ||
      event.locals.user?.active_school_year
    ) &&
    event.url.pathname !== '/setup'
  ) {
    redirectWithReturn(event, '/setup')
  }
  return resolve(event)
}
