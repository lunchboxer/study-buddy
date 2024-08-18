import { client, sql } from '$lib/data'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  const me = locals.user
  if (!me) return
  const schoolYearsResult = await client.execute(
    sql`SELECT * FROM school_year ORDER BY end_date DESC;`,
  )
  let groupsResult
  if (me.active_school_year) {
    const query = sql`SELECT * FROM student_group WHERE school_year_id = ${me.active_school_year} ORDER BY grade;`
    groupsResult = await client.execute(query)
  }
  return {
    me,
    schoolYears: schoolYearsResult?.rows || [],
    groups: groupsResult?.rows || [],
  }
}
