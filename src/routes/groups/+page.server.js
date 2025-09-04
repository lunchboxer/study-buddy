import { groupCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'

export const load = async ({ locals }) => {
  const result = await client.execute(
    sql`SELECT * FROM student_group WHERE school_year_id = ${locals?.user?.active_school_year} ORDER BY grade;`,
  )
  return { groups: result?.rows || [] }
}

export const actions = {
  create: async ({ request }) =>
    addAction(request, 'student_group', groupCreateSchema),
}
