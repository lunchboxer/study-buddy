import { client, sql } from '$lib/data'
import { assignmentCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async ({ locals }) => {
  const { active_school_year } = locals.user
  const result = await client.execute(
    sql`
      SELECT assignment.* FROM assignment 
      JOIN student_group ON assignment.student_group_id = student_group.id
      WHERE student_group.school_year_id = ${active_school_year}
      ORDER BY assignment.due_date;
    `,
  )
  return { assignments: result?.rows || [] }
}

export const actions = {
  create: async ({ request }) =>
    addAction(request, 'assignment', assignmentCreateSchema),
}
