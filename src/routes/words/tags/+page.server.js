import { client, sql } from '$lib/server/data'

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

export const actions = {}
