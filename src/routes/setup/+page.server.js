import { schoolYearCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'
import { mustStartBeforeEnd } from '$lib/server/validations'
import { fail } from '@sveltejs/kit'

export const actions = {
  create: ({ request }) => {
    return addAction(
      request,
      'school_year',
      schoolYearCreateSchema,
      mustStartBeforeEnd,
    )
  },
  setActiveSchoolYear: async ({ request, locals }) => {
    const formData = await request.formData()
    const result = await client.execute(
      sql`UPDATE user SET active_school_year = ${formData.get(
        'active_school_year',
      )} WHERE id = ${locals.user.id};`,
    )
    if (result.rowsAffected === 0) {
      return fail(500, { errors: { all: 'Could not set active school year' } })
    }
    return { success: true }
  },
}
