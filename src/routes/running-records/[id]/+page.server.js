import { client, sql } from '$lib/data'
import { runningRecordUpdateSchema } from '$lib/schema'
import { updateAction, deleteAction } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'

export async function load({ params, locals }) {
  const runningRecordResult = await client.execute(
    sql`SELECT
      rr.*,
      s.name AS student_name,
      rrt.title AS text_title,
      sg.name AS student_group_name,
      rrt.lexile AS lexile
    FROM
      running_record rr
    JOIN student s ON rr.student_id = s.id
    JOIN running_record_text rrt ON rr.text_id = rrt.id
    JOIN student_to_group stg ON s.id = stg.student_id
    JOIN student_group sg ON stg.student_group_id = sg.id
    WHERE
      rr.id = ${params.id}
      AND sg.school_year_id = ${locals.user.active_school_year}`,
  )
  return {
    runningRecord: runningRecordResult?.rows?.[0],
  }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'running_record'),
  updateComment: async ({ request, params }) => {
    const data = await request.formData()
    const id = params.id
    const comments = data.get('comments') || ''
    const query = sql`UPDATE running_record SET comments = ${comments} WHERE id = ${id};`
    const result = await client.execute(query)
    if (result.rowsAffected === 0) {
      return fail(500, { errors: { all: 'Could not update record' } })
    }
  },
  update: async ({ request }) =>
    updateAction(request, 'running_record', runningRecordUpdateSchema),
  insert: async ({ request }) => {
    const data = await request.formData()
    console.log(data)
  },
}
