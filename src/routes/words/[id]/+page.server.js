import { client, sql } from '$lib/server/data'
import { error } from '@sveltejs/kit'
import { wordNameUnique } from '$lib/server/validations'
import { wordUpdateSchema } from '$lib/schema'
import { deleteAction, updateAction } from '$lib/server-utils'

export const load = async ({ params }) => {
  const wordId = params.id
  const wordResult = await client.execute(
    sql`SELECT * FROM word WHERE id = ${wordId}`,
  )
  if (wordResult.rows.length === 0) {
    throw error(404, 'Word not found')
  }
  const word = wordResult.rows[0]
  return { word }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'word'),
  update: async ({ request }) =>
    updateAction(request, 'word', wordUpdateSchema, wordNameUnique),
}
