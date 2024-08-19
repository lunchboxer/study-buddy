import { client, sql } from '$lib/data'
import { runningRecordCreateSchema } from '$lib/schema'
import { addAction } from '$lib/server-utils'

export const load = async () => {
  const result = await client.execute(
    sql`SELECT * FROM running_record ORDER BY created DESC;`,
  )
  const activeSchoolYear = 'B0B0St3n6YaH'
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
    runningRecords: result?.rows || [],
    students: activeStudents?.rows || [],
    texts: textsResult?.rows || [],
  }
}

export const actions = {
  create: ({ request }) => {
    return addAction(request, 'running_record', runningRecordCreateSchema)
  },
}
