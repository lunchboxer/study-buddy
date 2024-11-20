import { client, sql } from '$lib/server/data'
import { error, fail } from '@sveltejs/kit'
import { wordTagUpdateSchema, addParentTagSchema } from '$lib/schema'
import { wordTagNameUnique } from '$lib/server/validations'
import { deleteAction, updateAction, parseForm } from '$lib/server-utils'

export const load = async ({ params }) => {
  const tagId = params.id
  const tagResult = await client.execute(sql`
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
    WHERE 
        wt.id = ${tagId}
    ORDER BY 
        wt.parent_tag_id NULLS FIRST, 
        wt.order_index NULLS LAST,
        wt.name;
  `)
  const tag = tagResult?.rows?.[0]
  if (!tagResult?.rows?.[0]) {
    throw error(404, 'Word tag not found.')
  }

  const tagsQuery = sql`
    SELECT 
      id,
      name
    FROM 
      word_tag
    ORDER BY 
      name;
  `
  const tagsResult = await client.execute(tagsQuery)
  const tags = tagsResult?.rows
  return { tag, tags }
}

export const actions = {
  delete: async ({ request }) => deleteAction(request, 'word_tag'),
  update: async ({ request }) =>
    updateAction(request, 'word_tag', wordTagUpdateSchema, wordTagNameUnique),
  addParentTag: async ({ request }) => {
    const formData = await parseForm(addParentTagSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    const { tag_id, parent_tag_id } = formData
    const addParentTagQuery = sql`
      UPDATE word_tag SET parent_tag_id = ${parent_tag_id} WHERE id = ${tag_id};
    `
    const addParentTagResult = await client.execute(addParentTagQuery)
    if (addParentTagResult.rowsAffected === 0) {
      return fail(500, {
        errors: { all: 'Could not add parent tag' },
      })
    }
    return { success: true }
  },
}
