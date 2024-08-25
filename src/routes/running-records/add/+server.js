import { dev } from '$app/environment'
import { client } from '$lib/server/data'
import { runningRecordCreateSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { generateInsertSql } from '$lib/server-utils'
import { error, json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const data = await parsePost(runningRecordCreateSchema, request)
  if (data.errors) {
    error(400, { errors: data.errors })
  }
  try {
    const newRecordResult = await client.execute(
      generateInsertSql(data, 'running_record'),
    )
    if (newRecordResult.rowsAffected === 0) {
      error(500, 'New record was not added to database.')
    }
    return json({ success: true })
  } catch (error_) {
    dev && console.error(error_)
    error(500, 'A server error occurred when adding record.')
  }
}
