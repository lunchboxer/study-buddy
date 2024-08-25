import { client, sql } from '$lib/server/data'
import { runningRecordTextCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
  const result = await client.execute(
    sql`SELECT * FROM running_record_text ORDER BY lexile ASC;`,
  )
  return {
    runningRecordTexts: result?.rows || [],
  }
}
export const actions = {
  create: ({ request }) => {
    return addAction(
      request,
      'running_record_text',
      runningRecordTextCreateSchema,
    )
  },
}
