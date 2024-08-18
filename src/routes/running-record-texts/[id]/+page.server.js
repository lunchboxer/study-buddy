import { client, sql } from '$lib/data'
import { runningRecordTextUpdateSchema } from '$lib/schema'
import { updateAction, deleteAction } from '$lib/server-utils'

export async function load({ params }) {
  const runningRecordTextResult = await client.execute(
    sql`SELECT * FROM running_record_text WHERE id = ${params.id};`,
  )
  return {
    runningRecordText: runningRecordTextResult?.rows?.[0],
  }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'running_record_text'),
  update: async ({ request }) =>
    updateAction(request, 'running_record_text', runningRecordTextUpdateSchema),
}
