import { error, json } from '@sveltejs/kit'
import { client, sql } from '$lib/data'

function parseWord(word) {
  if (!word) {
    return {}
  }
  const match = word.match(/\[(.*?)\](.*?)\[\/.*?\]/)
  if (match) {
    return { type: match[1], text: match[2] }
  }
  return { type: undefined, text: word }
}

function unMarkAll(text) {
  return text.replace(/\[.*?\]/, '')
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ params, request }) => {
  const { index, type, all } = await request.json()
  if (!(type || all)) {
    error(400, 'No type or all specified')
  }

  const runningRecordId = params.id

  const getTextResult = await client.execute(
    sql`SELECT * FROM running_record WHERE id = ${runningRecordId};`,
  )
  if (!getTextResult?.rows?.[0]) {
    error(404, 'Running record text not found.')
  }
  const text = getTextResult?.rows?.[0].marked_text

  let markedText

  if (type) {
    const words = text.split(/\s+/)
    const word = parseWord(words[index])
    if (type === 'unmark') {
      words[index] = unMarkAll(word.text)
    } else {
      words[index] = `[${type}]${word.text}[/${type}]`
    }
    markedText = words.join(' ')
  } else {
    markedText = all
  }

  const updateResult = await client.execute(
    sql`UPDATE running_record SET marked_text = ${markedText} WHERE id = ${runningRecordId};`,
  )
  if (updateResult.rowsAffected === 0) {
    error(500, 'Could not update record')
  }
  return json({ success: true })
}
