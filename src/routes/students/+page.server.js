import { dev } from '$app/environment'
import { client, sql, executeBatch } from '$lib/server/data'
import { studentCreateSchema } from '$lib/schema'
import { parseForm } from '$lib/server-utils'
import { fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'
import { PASSWORD_OPTIONS } from '$lib/constants'

function generateUsername(name) {
  const parts = name.toLowerCase().split(' ')
  let username = parts[0]
  if (parts.length > 1) {
    for (let index = 1; index < parts.length; index++) {
      const initials = parts[index].replaceAll(/[^a-z]/g, '')
      if (initials.length > 0) {
        username += initials[0]
      }
    }
  }

  const randomNumber = Math.floor(Math.random() * 100)
  username += randomNumber

  return username
}

function generatePassword() {
  const passwordLength = Math.floor(Math.random() * 2) + 2
  const password = new Set()
  for (let index = 0; index < passwordLength; index++) {
    const word =
      PASSWORD_OPTIONS[Math.floor(Math.random() * PASSWORD_OPTIONS.length)]
    password.add(word)
  }
  // convert the set to a string with commas between each word
  return [...password].sort((a, b) => a.localeCompare(b)).join(',')
}

async function getAvailableUsername(name) {
  const username = generateUsername(name)
  const usernameTakenQuery = sql`
    SELECT id
    FROM user
    WHERE username = ${username}
  `
  const usernameTakenResult = await client.execute(usernameTakenQuery)
  if (usernameTakenResult.rows.length > 0) {
    const newUsername = generateUsername(username)
    return await getAvailableUsername(newUsername)
  }
  return username
}

export async function load() {
  const query = sql`
    SELECT u.*
    FROM user u
    JOIN user_role ur ON u.id = ur.user_id
    JOIN role r ON ur.role_id = r.id
    WHERE r.name = 'student'
    ORDER BY u.name;
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

      const username = await getAvailableUsername(formData.name)
      const password = generatePassword()

      const roleQuery = sql`
        SELECT id
        FROM role
        WHERE name = 'student'
      `
      const roleResult = await client.execute(roleQuery)
      const roleId = roleResult?.rows[0]?.id
      const studentRoleId = roleId || nanoid(12)

      if (!roleId) {
        const newRoleQuery = sql`
          INSERT INTO role (id, name) VALUES (${studentRoleId}, 'student');
        `
        await client.execute(newRoleQuery)
      }

      const newStudentQuery = sql`
        INSERT INTO user (id, username, password, name) VALUES (${userId}, ${username}, ${password}, ${formData.name});

        INSERT INTO user_role (user_id, role_id)
          VALUES (${userId}, ${studentRoleId});

        INSERT INTO student_to_group (student_id, student_group_id)
          VALUES (${userId}, ${formData.student_group_id});
      `
      const newStudentResult = await executeBatch(newStudentQuery)

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
