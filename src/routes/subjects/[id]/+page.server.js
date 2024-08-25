import { client, sql } from '$lib/server/data'
import { subjectNameUnique } from '$lib/server/validations'
import { subjectUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'

export async function load({ params }) {
  const result = await client.execute(
    sql`SELECT * FROM subject WHERE id = ${params.id};`,
  )
  return {
    subject: result?.rows?.[0],
  }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'subject'),
  update: async ({ request }) =>
    updateAction(request, 'subject', subjectUpdateSchema, subjectNameUnique),
}
