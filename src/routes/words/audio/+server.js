import { dev } from '$app/environment'
import { wordAudioCreateSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'
import { error, json } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request, locals }) => {
  const data = await parsePost(wordAudioCreateSchema, request)
  if (data.errors) {
    error(400, { errors: data.errors })
  }
  const speakerId = locals.user.id
  const id = nanoid(12)
  try {
    await client.execute(sql`
      INSERT INTO word_audio (id, word_id, audio_url, type, speaker_id)
      VALUES (${id}, ${data.word_id}, ${data.audio_url}, ${data.type}, ${speakerId});
    `)
    return json({ success: true })
  } catch (error) {
    dev && console.error(error)
    return json(
      { success: false, error: 'Failed to insert audio record.' },
      { status: 500 },
    )
  }
}
