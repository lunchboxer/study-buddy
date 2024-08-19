import { dev } from '$app/environment'
import { error } from '@sveltejs/kit'
import { client, sql } from '$lib/data'
import {
  addStudentToGroupSchema,
  studentUpdateSchema,
  toggleArchiveStudentSchema,
} from '$lib/schema'
import { parseForm, updateAction } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'

export async function load({ params }) {
  const studentResult = await client.execute(
    sql`SELECT * FROM student WHERE id = ${params.id};`,
  )
  if (!studentResult?.rows?.[0]) {
    throw error(404, 'Student not found.')
  }

  const query = sql`
    SELECT student_group.id, student_group.name, student_group.school_year_id
    FROM student_to_group 
    JOIN student_group ON student_to_group.student_group_id = student_group.id
    WHERE student_to_group.student_id = ${params.id};`
  const studentGroupsResult = await client.execute(query)
  return {
    student: studentResult?.rows?.[0],
    studentGroups: studentGroupsResult?.rows || [],
  }
}

export const actions = {
  delete: async ({ request }) => {
    const data = await request.formData()
    const id = data.get('id')
    try {
      await client.execute(
        sql`DELETE FROM student_to_group WHERE student_id = ${id};`,
      )
      const result = await client.execute(
        sql`DELETE FROM student WHERE id = ${id};`,
      )
      if (result.changes === 0) {
        return fail(500, { errors: { all: 'Could not delete record' } })
      }
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, { errors: { all: 'Could not delete record' } })
    }
  },
  update: async ({ request }) =>
    updateAction(request, 'student', studentUpdateSchema),
  addGroup: async ({ request }) => {
    const formData = await parseForm(addStudentToGroupSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    try {
      const addGroupResult = await client.execute(
        sql`INSERT INTO student_to_group (student_id, student_group_id) 
        VALUES (${formData.student_id}, ${formData.student_group_id});`,
      )
      if (addGroupResult.rowsAffected === 0) {
        return fail(500, { errors: { all: 'Could not add group to student' } })
      }
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, { errors: { all: 'Could not add group to student' } })
    }
  },
  removeFromGroup: async ({ request }) => {
    const formData = await parseForm(addStudentToGroupSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    try {
      const result = await client.execute(
        sql`DELETE FROM student_to_group 
        WHERE student_id = ${formData.student_id} 
        AND student_group_id = ${formData.student_group_id};`,
      )
      if (result.rowsAffected === 0) {
        return fail(500, {
          errors: { all: 'Could not remove group from student' },
        })
      }
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, {
        errors: { all: 'Could not remove group from student' },
      })
    }
  },
  toggleArchive: async ({ request }) => {
    const formData = await parseForm(toggleArchiveStudentSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    try {
      const result = await client.execute(
        sql`UPDATE student SET archived = ${formData.archived} WHERE id = ${formData.student_id};`,
      )
      if (result.rowsAffected === 0) {
        return fail(500, { errors: { all: 'Could not update student' } })
      }
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, { errors: { all: 'Could not update student' } })
    }
  },
}
