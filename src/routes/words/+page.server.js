import { client, sql } from '$lib/server/data'
import { wordCreateSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export const load = async () => {
  const result = await client.execute(sql`SELECT * FROM word ORDER BY word;`)
  const words = result?.rows || []
  const tagsResult = await client.execute(sql`SELECT * FROM word_tag;`)
  const tags = tagsResult?.rows || []
  return { words, tags }
}

export const actions = {
  // create: ({ request }) => addAction(request, 'word', wordCreateSchema),
  create: async ({ request }) => {
    // words, existingTagId, newTagName
    const formData = await parseForm(wordCreateSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { words, existingTagId, newTagName } = formData
    // to start we only support adding one tag at a time.
    // Later we can add multiple tags.
    let tagId = existingTagId
    if (newTagName) {
      tagId = nanoid(12)
      const tagExistsQuery = sql`
        SELECT id
        FROM word_tag
        WHERE name = ${newTagName}
      `
      const tagExistsResult = await client.execute(tagExistsQuery)
      if (tagExistsResult.rows.length > 0) {
        // no need to return an error, just use the existing tag
        tagId = tagExistsResult.rows[0].id
      } else {
        const newTagQuery = sql`
          INSERT INTO word_tag (id, name) VALUES (${tagId}, ${newTagName}) 
          ON CONFLICT (name) DO NOTHING;
        `
        const newTagResult = await client.execute(newTagQuery)
        if (newTagResult.rowsAffected === 0) {
          return fail(500, {
            errors: { newTagName: 'Could not create new tag' },
          })
        }
      }
    }
    const wordsWithIds = words.split(',').map(word => {
      return { text: word, id: nanoid(12) }
    })
    const insertWordsQuery = `
      INSERT INTO word (id, word)
      VALUES ${wordsWithIds
        .map(word => {
          return `('${word.id}', '${word.text}')`
        })
        .join(', ')}
      ON CONFLICT (word) DO NOTHING;
    `
    const insertWordsResult = await client.execute(insertWordsQuery)
    if (insertWordsResult.rowsAffected === 0) {
      return fail(500, {
        errors: { newTagName: 'Could not create new tag' },
      })
    }
    if (tagId) {
      const insertWordTagQuery = `
        INSERT INTO word_tag_to_word (word_tag_id, word_id)
        VALUES ${wordsWithIds
          .map(word => {
            return `('${tagId}', '${word.id}')`
          })
          .join(', ')}
        ON CONFLICT (word_tag_id, word_id) DO NOTHING;
      `
      await client.execute(insertWordTagQuery)
    }
    await client.execute(insertWordsQuery)
    return { success: true }
  },
}
