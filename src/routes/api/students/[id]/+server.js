import { error, json } from '@sveltejs/kit'
import { client, sql } from '$lib/data'

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params }) => {
  const studentResult = await client.execute(
    sql`SELECT * FROM student WHERE id = ${params.id};`,
  )
  if (!studentResult?.rows?.[0]) {
    error(404, 'Student not found.')
  }
  const query = sql`
    SELECT student_group.id, student_group.name, student_group.school_year_id
    FROM student_to_group 
    JOIN student_group ON student_to_group.student_group_id = student_group.id
    WHERE student_to_group.student_id = ${params.id};`
  const studentGroupsResult = await client.execute(query)
  return json({
    student: studentResult?.rows?.[0],
    studentGroups: studentGroupsResult?.rows || [],
  })
}

/** @type {import('./$types').RequestHandler} */
export const DELETE = async ({ params }) => {
  await client.execute(
    sql`DELETE FROM student_to_group WHERE student_id = ${params.id};`,
  )
  const result = await client.execute(
    sql`DELETE FROM student WHERE id = ${params.id};`,
  )
  if (result.rowsAffected === 0) {
    error(500, 'Could not delete record')
  }
  return json({ success: true })
}
