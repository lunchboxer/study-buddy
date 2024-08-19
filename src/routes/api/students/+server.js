import { dev } from '$app/environment'
import { client, sql } from '$lib/data'
import { studentCreateSchema } from '$lib/schema'
import { parsePost } from '$lib/server-utils'
import { error, json } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
  const result = await client.execute(sql`SELECT * FROM student ORDER BY name;`)
  return json({ students: result?.rows || [] })
}

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
  const formData = await parsePost(studentCreateSchema, request)
  if (formData.errors) {
    error(400, { errors: formData.errors })
  }
  try {
    const id = nanoid(12)
    const newStudentResult = await client.execute(
      sql`INSERT INTO student (id, name) VALUES (${id}, ${formData.name});`,
    )
    if (newStudentResult.rowsAffected === 0) {
      error(500, 'New student was not added to database.')
    }
    const studentToGroupResult = await client.execute(
      sql`INSERT INTO student_to_group (student_id, student_group_id) VALUES (${id}, ${formData.student_group_id});`,
    )
    if (studentToGroupResult.rowsAffected === 0) {
      error(500, 'New student was not added to group.')
    }
    return json({ success: true })
  } catch (error) {
    dev && console.error(error)
    return error(500, 'A server error occurred when adding student.')
  }
}
