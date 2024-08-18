import { client, sql } from '$lib/data'
import { runningRecordCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
  const result = await client.execute(
    sql`SELECT * FROM running_record ORDER BY created DESC;`,
  )
  return {
    runningRecords: result?.rows || [],
  }
}
export const actions = {
  create: ({ request }) => {
    return addAction(request, 'running_record', runningRecordCreateSchema)
  },
}
