import { client, sql } from '$lib/server/data'

export async function load() {
  const result = await client.execute(sql`
    SELECT name, id FROM student;
  `)
  const students = result?.rows || []
  return { students }
}

export const actions = {
  login: async ({ request }) => {
    const { studentId, password } = await request.formData()
    const result = await client.execute(sql`
      SELECT name, id FROM student WHERE id = ${studentId} AND password = ${password};
    `)
    const student = result?.rows?.[0]
    if (student) {
      return {
        studentId: student.id,
        studentName: student.name,
      }
    }
    throw new Response('Invalid credentials', { status: 401 })
  },
}
