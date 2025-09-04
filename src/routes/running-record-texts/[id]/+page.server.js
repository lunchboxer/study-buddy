import { runningRecordTextUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'

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
