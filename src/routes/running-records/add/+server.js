import { dev } from '$app/environment'
import { client } from '$lib/data'
import { runningRecordCreateSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { error, json } from '@sveltejs/kit'
import { generateInsertSQL } from '$lib/server-utils'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const data = await parsePost(runningRecordCreateSchema, request)
  if (data.errors) {
    error(400, { errors: data.errors })
  }
  try {
    const newRecordResult = await client.execute(
      generateInsertSQL(data, 'running_record'),
    )
    if (newRecordResult.rowsAffected === 0) {
      error(500, 'New record was not added to database.')
    }
    return json({ success: true })
  } catch (errors) {
    dev && console.error(errors)
    error(500, 'A server error occurred when adding record.')
  }
}
