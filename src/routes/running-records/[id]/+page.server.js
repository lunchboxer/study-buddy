import { client, sql } from '$lib/data'
import { runningRecordUpdateSchema } from '$lib/schema'
import { updateAction, deleteAction } from '$lib/server-utils'

export async function load({ params, locals }) {
  const runningRecordResult = await client.execute(
    sql`SELECT
      rr.*,
      s.name AS student_name,
      rrt.title AS text_title,
      sg.name AS student_group_name
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
  update: async ({ request }) =>
    updateAction(request, 'running_record', runningRecordUpdateSchema),
}
