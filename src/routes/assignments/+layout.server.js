import { client } from '$lib/data'

export const load = async () => {
  const result = await client.execute('SELECT * from subject;')
  return { subjects: result?.rows || [] }
}
