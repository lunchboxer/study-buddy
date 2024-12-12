import { subjectCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'
import { client } from '$lib/server/data'
import { subjectNameUnique } from '$lib/server/validations'

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
