import { client } from '$lib/data'
import { subjectNameUnique } from '$lib/data/validations'
import { subjectCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
  const results = await client.execute('SELECT * FROM subject;')
  return { subjects: results?.rows || [] }
}

export const actions = {
  create: ({ request }) => {
    return addAction(request, 'subject', subjectCreateSchema, subjectNameUnique)
  },
}
