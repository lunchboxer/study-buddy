import { client, sql } from '$lib/server/data'
import { error, fail } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { wordNameUnique } from '$lib/server/validations'
import {
  wordUpdateSchema,
  wordRemoveTagSchema,
  wordAttachTagSchema,
} from '$lib/schema'
import { deleteAction, updateAction, parseForm } from '$lib/server-utils'
import { nanoid } from 'nanoid'

export const load = async ({ params }) => {
  const wordId = params.id
  const wordResult = await client.execute(
    // get word and related tags
    sql`
      SELECT w.id, w.word, JSON_GROUP_ARRAY(JSON_OBJECT('id', wt.id, 'name', wt.name)) AS tags
      FROM word w
      LEFT JOIN word_tag_to_word wttw ON w.id = wttw.word_id
      LEFT JOIN word_tag wt ON wttw.word_tag_id = wt.id
      WHERE w.id = ${wordId}
      GROUP BY w.id, w.word;
    `,
  )
  if (wordResult.rows.length === 0) {
    throw error(404, 'Word not found')
  }
  const tagsResult = await client.execute(sql`
    SELECT id, name FROM word_tag;
  `)
  const tags = tagsResult?.rows || []

  const word = wordResult.rows[0]
  if (word.tags) {
    word.tags = JSON.parse(word.tags)
    word.tags = word.tags.filter(tag => tag.id !== null)
  }
  return { word, allTags: tags }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'word'),
  update: async ({ request }) =>
    updateAction(request, 'word', wordUpdateSchema, wordNameUnique),
  removeTag: async ({ request, params }) => {
    const wordId = params.id
    const formData = await parseForm(wordRemoveTagSchema, request)
    const removeTagQuery = sql`
      DELETE FROM word_tag_to_word
      WHERE word_tag_id = ${formData.id}
      AND word_id = ${wordId};
    `
    const removeTagResult = await client.execute(removeTagQuery)
    if (removeTagResult.rowsAffected === 0) {
      return fail(500, {
        errors: { id: 'Could not remove tag' },
      })
    }
    return { success: true }
  },
  attachTag: async ({ request, params }) => {
    const wordId = params.id
    const formData = await parseForm(wordAttachTagSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    let { tag_name, tag_id } = formData

    // if tag_id is present then they are trying to attach an existing tag
    if (tag_id) {
      // try to attach. If it fails, it's because the tag doesn't exist
      const attachTagQuery = sql`
        INSERT OR IGNORE INTO word_tag_to_word (word_id, word_tag_id)
        VALUES (${wordId}, ${tag_id})
      `
      const attachTagResult = await client.execute(attachTagQuery)
      if (attachTagResult.rowsAffected === 0) {
        // tag doesn't exist so try to create it
      }
    } else {
      // tag_id is not present so we need to create a new tag
      const tagExistsQuery = sql`
        SELECT id
        FROM word_tag
        WHERE name = ${tag_name}
      `
      const tagExistsResult = await client.execute(tagExistsQuery)
      if (tagExistsResult.rows.length > 0) {
        // no need to return an error, just use the existing tag
        tag_id = tagExistsResult.rows[0].id
      } else {
        // tag is a new name
        // create it
        tag_id = nanoid(12)
        const newTagQuery = sql`
          INSERT OR IGNORE INTO word_tag (id, name) VALUES (${tag_id}, ${tag_name})
        `
        const newTagResult = await client.execute(newTagQuery)
        if (newTagResult.rowsAffected === 0) {
          return fail(500, {
            errors: { newTagName: 'Could not create new tag' },
          })
        }
      }

      // we have a tagId, attach it to the word
      const attachTagQuery = sql`
        INSERT OR IGNORE INTO word_tag_to_word (word_tag_id, word_id)
        VALUES (${tag_id}, ${wordId})
      `
      const attachTagResult = await client.execute(attachTagQuery)

      if (attachTagResult.rowsAffected === 0) {
        dev && console.error(attachTagResult)
        return fail(500, {
          errors: { name: 'Could not attach tag' },
        })
      }
    }

    return { success: true }
  },
}
