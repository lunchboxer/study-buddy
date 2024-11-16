import { dev } from '$app/environment'
import { client, sql } from '$lib/server/data'
import { studentCreateSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export async function load() {
  const query = sql`
    SELECT u.*
    FROM user u
    JOIN user_role ur ON u.id = ur.user_id
    JOIN role r ON ur.role_id = r.id
    WHERE r.name = 'student';
  `

  const result = await client.execute(query)
  return {
    students: result?.rows || [],
  }
}

export const actions = {
  create: async ({ request }) => {
    const formData = await parseForm(studentCreateSchema, request)
    if (formData.errors) {
      return fail(400, formData)
    }
    try {
      const userId = nanoid(12)
      const roleId = nanoid(12)
      // need to insert a password too, since it's required on user table
      const newStudentQuery = sql`
        INSERT INTO user (id, name) VALUES (${userId}, ${formData.name});

        INSERT OR IGNORE INTO role (id, name)
          VALUES (${roleId}, 'student');

        INSERT INTO user_role (user_id, role_id)
          VALUES (${userId}, ${roleId});

        INSERT INTO student_to_group (student_id, student_group_id)
          VALUES (${userId}, ${formData.student_group_id});
      `
      const newStudentResult = await client.execute(newStudentQuery)
      if (newStudentResult.rowsAffected === 0) {
        return fail(500, {
          errors: { all: 'New student was not added to database.' },
        })
      }
      return { success: true }
    } catch (error) {
      dev && console.error(error)
      return fail(500, {
        errors: { all: 'A server error occurred when adding student.' },
      })
    }
  },
}
