import { dev } from '$app/environment'
import { wordTagCreateSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { client, sql } from '$lib/server/data'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export const load = async () => {
  const tagsResult = await client.execute(sql`
    WITH tag_word_counts AS (
        SELECT 
            word_tag_id, 
            COUNT(word_id) AS word_count
        FROM word_tag_to_word
        GROUP BY word_tag_id
    )

    SELECT 
        wt.id,
        wt.name,
        wt.parent_tag_id,
        pt.name AS parent_tag_name,
        COALESCE(twc.word_count, 0) AS word_count,
        wt.order_index,
        wt.created
    FROM 
        word_tag wt
    LEFT JOIN 
        word_tag pt ON wt.parent_tag_id = pt.id
    LEFT JOIN 
        tag_word_counts twc ON wt.id = twc.word_tag_id
    ORDER BY 
        wt.parent_tag_id NULLS FIRST, 
        wt.order_index NULLS LAST,
        wt.name;
  `)
  const tags = tagsResult?.rows || []
  return { tags }
}

export const actions = {
  addTag: async ({ request }) => {
    const formData = await parseForm(wordTagCreateSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { name } = formData

    const insertTagQuery = sql`
      INSERT OR IGNORE INTO word_tag (id, name)
      VALUES (${nanoid(12)}, ${name})
    `
    const insertTagResult = await client.execute(insertTagQuery)
    if (insertTagResult.rowsAffected === 0) {
      dev && console.error(insertTagResult)
      return fail(500, {
        errors: { name: 'A tag with this name already exists' },
      })
    }
    return { success: true }
  },
}
