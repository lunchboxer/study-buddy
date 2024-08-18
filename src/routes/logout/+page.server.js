import { dev } from '$app/environment'

export const actions = {
  default: ({ cookies }) => {
    cookies.set('auth', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      secure: !dev,
    })
    return { success: true }
  },
}
