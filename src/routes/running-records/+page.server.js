import { client, sql } from '$lib/data'
import { runningRecordCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async ({ locals }) => {
  const activeSchoolYear = locals?.user?.active_school_year
  const runningRecordsresult = await client.execute(sql`
    SELECT
      rr.*,
      s.name AS studentName,
      rrt.title AS textTitle
    FROM
      running_record rr
    JOIN student s ON rr.student_id = s.id
    JOIN student_to_group stg ON s.id = stg.student_id
    JOIN student_group sg ON stg.student_group_id = sg.id
    JOIN running_record_text rrt ON rr.text_id = rrt.id
    WHERE
      sg.school_year_id = ${activeSchoolYear}
    ORDER BY rr.created DESC;`)

  const activeStudents = await client.execute(sql`
    SELECT DISTINCT student.*, sg.name AS group_name
    FROM user
    JOIN student_group sg ON user.active_school_year = sg.school_year_id
    JOIN student_to_group stg ON sg.id = stg.student_group_id
    JOIN student ON stg.student_id = student.id
    WHERE user.active_school_year = ${activeSchoolYear}
      AND student.archived = 0
    ORDER BY student.name;`)
  const textsResult = await client.execute(
    sql`SELECT * FROM running_record_text ORDER BY lexile ASC;`,
  )
  return {
    runningRecords: runningRecordsresult?.rows || [],
    students: activeStudents?.rows || [],
    texts: textsResult?.rows || [],
  }
}

export const actions = {
  create: ({ request }) => {
    return addAction(request, 'running_record', runningRecordCreateSchema)
  },
}
