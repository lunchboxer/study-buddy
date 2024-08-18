import { client, sql } from '$lib/data'
import { groupUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'

export async function load({ params }) {
  const result = await client.execute(
    sql`SELECT * FROM student_group WHERE id = ${params.id};`,
  )
  return {
    group: result?.rows[0],
  }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'student_group'),
  update: async ({ request }) =>
    updateAction(request, 'student_group', groupUpdateSchema),
}
