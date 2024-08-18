import { client, sql } from '$lib/data'
import { mustStartBeforeEnd } from '$lib/data/validations'
import { schoolYearUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
  const result = await client.execute(
    sql`SELECT * FROM school_year WHERE id = ${params.id};`,
  )
  const schoolYear = result?.rows?.[0]
  if (!schoolYear) {
    throw error(404, "School year doesn't exist")
  }
  return { schoolYear }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'school_year'),
  update: async ({ request }) =>
    updateAction(
      request,
      'school_year',
      schoolYearUpdateSchema,
      mustStartBeforeEnd,
    ),
}
