import { dev } from '$app/environment'
import { client, sql } from '$lib/data'
import { studentCreateSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export async function load() {
  const result = await client.execute(sql`SELECT * FROM student ORDER BY name;`)
  return {
    students: result?.rows || [],
  }
}

export const actions = {
  create: async ({ request }) => {
    const formData = await parseForm(studentCreateSchema, request)
    if (formData.errors) return fail(400, formData)
    try {
      const id = nanoid(12)
      const newStudentResult = await client.execute(
        sql`INSERT INTO student (id, name) VALUES (${id}, ${formData.name});`,
      )
      if (newStudentResult.rowsAffected === 0)
        return fail(500, {
          errors: { all: 'New student was not added to database.' },
        })
      const studentToGroupResult = await client.execute(
        sql`INSERT INTO student_to_group (student_id, student_group_id) VALUES (${id}, ${formData.student_group_id});`,
      )
      if (studentToGroupResult.rowsAffected === 0)
        return fail(500, {
          errors: { all: 'New student was not added to group.' },
        })
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, {
        errors: { all: 'A server error occurred when adding student.' },
      })
    }
  },
}
