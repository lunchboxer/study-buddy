import { assignmentUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'

export const load = async ({ params }) => {
  const result = await client.execute(
    sql`SELECT * FROM assignment WHERE id = ${params.id};`,
  )
  return {
    assignment: result?.rows?.[0],
  }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'assignment'),
  update: async ({ request }) =>
    updateAction(request, 'assignment', assignmentUpdateSchema),
}
