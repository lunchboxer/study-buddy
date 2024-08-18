import { client, sql } from '$lib/data'
import { runningRecordUpdateSchema } from '$lib/schema'
import { updateAction, deleteAction } from '$lib/server-utils'

export async function load({ params }) {
  const runningRecordResult = await client.execute(
    sql`SELECT * FROM running_record WHERE id = ${params.id};`,
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
