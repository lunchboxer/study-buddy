import { dev } from '$app/environment'
import { client, sql } from '$lib/server/data'
import { error, fail } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

export function generateInsertSql(data, tableName) {
  data.id = nanoid(12)
  const columns = Object.keys(data).join(', ')
  const values = Object.values(data)
  const placeholders = values.map(() => '?').join(', ')

  return {
    sql: `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
    args: values,
  }
}

export function generateUpdateSql(data, tableName) {
  const columns = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ')
  const values = Object.values(data)
  return {
    sql: `UPDATE ${tableName} SET ${columns} WHERE id = ?`,
    args: [...values, data.id],
  }
}

export async function parseForm(schema, request) {
  const formDataThing = await request.formData()
  const formDataObject = Object.fromEntries(formDataThing)
  const parsedData = schema.safeParse(formDataObject)

  if (!parsedData.success) {
    dev && console.error(parsedData.error)
    formDataObject.errors = {}
    for (const error of parsedData.error.errors) {
      formDataObject.errors[error.path[0]] = error.message
    }
  }
  return formDataObject
}

export async function parsePost(schema, request) {
  const formData = await request.json()
  const parsedData = schema.safeParse(formData)

  if (!parsedData.success) {
    dev && console.error(parsedData.error)
    formData.errors = {}
    for (const error of parsedData.error.errors) {
      formData.errors[error.path[0]] = error.message
    }
  }
  return formData
}

export const deleteAction = async (request, tableName) => {
  const data = await request.formData()
  const id = data.get('id')
  const result = await client.execute({
    sql: `DELETE FROM ${tableName} WHERE id = ?`,
    args: [id],
  })
  if (result.rowsAffected === 0) {
    return fail(500, { errors: { all: 'Could not delete record' } })
  }
  return { success: true }
}

export const updateAction = async (
  request,
  tableName,
  validationSchema,
  otherValidations,
  customQueryObject,
) => {
  const formData = await parseForm(validationSchema, request)
  if (formData.errors) {
    return fail(400, formData)
  }
  try {
    if (otherValidations) {
      const validations = Array.isArray(otherValidations)
        ? otherValidations
        : [otherValidations]
      for (const validation of validations) {
        const errors = await validation(formData)
        if (errors) {
          return fail(400, errors)
        }
      }
    }
    const sql = customQueryObject || generateUpdateSql(formData, tableName)
    const result = await client.execute(sql)
    if (result.rowsAffected === 0) {
      return fail(500, {
        errors: { all: 'Record was not updated.' },
      })
    }
    return { success: true }
  } catch (error) {
    dev && console.error(error)
    return fail(500, {
      errors: { all: 'Record was not updated.' },
    })
  }
}

export const addAction = async (
  request,
  tableName,
  validationSchema,
  otherValidations,
  customQueryObject,
) => {
  const formData = await parseForm(validationSchema, request)

  if (formData.errors) {
    return fail(400, formData)
  }
  try {
    if (otherValidations) {
      const validations = Array.isArray(otherValidations)
        ? otherValidations
        : [otherValidations]
      for (const validation of validations) {
        const errors = await validation(formData)
        if (errors) {
          return fail(400, errors)
        }
      }
    }
    const sql = customQueryObject || generateInsertSql(formData, tableName)
    const result = await client.execute(sql)
    if (result.rowsAffected === 0) {
      return fail(500, {
        errors: { all: 'New record was not added.' },
      })
    }
    return { success: true }
  } catch (error) {
    dev && console.error(error)
    return fail(500, {
      errors: { all: 'New record was not added.' },
    })
  }
}

export const userHasRole = async (userId, roleName) => {
  const result = await client.execute(
    sql`
      SELECT
        user_role.*,
        role.name AS role_name
      FROM
        user_role
        LEFT JOIN role ON user_role.role_id = role.id
      WHERE
        user_id = ${userId}
        AND role.name = ${roleName};
    `,
  )
  return result?.rows?.length > 0
}

export const isAdminOrFail = async userId => {
  const isAdmin = await userHasRole(userId, 'admin')
  if (!isAdmin) {
    return fail(403, {
      errors: { all: 'You must be an admin to do that.' },
    })
  }
}

export const isAdminOrError = async (
  userId,
  errorMessage = 'You must be an admin to do that',
) => {
  const isAdmin = await userHasRole(userId, 'admin')
  if (!isAdmin) {
    throw error(403, errorMessage)
  }
}
