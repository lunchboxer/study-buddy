import { client, sql } from '$lib/server/data'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  const me = locals.user
  if (!me) {
    return
  }
  const schoolYearsResult = await client.execute(
    sql`SELECT * FROM school_year ORDER BY end_date DESC;`,
  )
  const query = sql`SELECT * FROM student_group ORDER BY grade;`
  const groupsResult = await client.execute(query)
  return {
    me,
    schoolYears: schoolYearsResult?.rows || [],
    groups: groupsResult?.rows || [],
  }
}
