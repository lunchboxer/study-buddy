import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Username is required' })
    .max(18),
  password: z
    .string()
    .trim()
    .min(4, { message: 'Password is 4-20 characters' })
    .max(20, { message: 'Password is 4-20 characters' }),
})
export const studentLoginSchema = z.object({
  studentId: z.string(),
  password: z.string().trim().min(3),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().max(60),
})

export const userCreateSchema = z.object({
  email: z.union([z.string().trim().email(), z.string().max(0), z.null()]),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Username is required' })
    .max(18),
  password: z
    .string()
    .trim()
    .min(4, { message: 'Password is 4-20 characters' })
    .max(20, { message: 'Password is 4-20 characters' }),
  name: z.string().trim().max(60),
})

export const userUpdateSchema = z.object({
  id: z.string(),
  email: z.union([z.string().trim().email(), z.string().max(0), z.null()]),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Username is required' })
    .max(18),
  name: z.string().trim().max(60),
})

export const userUpdatePasswordSchema = z.object({
  id: z.string(),
  password: z
    .string()
    .trim()
    .min(4, { message: 'Password is 4-20 characters' })
    .max(20, { message: 'Password is 4-20 characters' }),
})

export const roleCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
})

export const roleUpdateSchema = roleCreateSchema.extend({
  id: z.string(),
})

export const userRoleSchema = z.object({
  role_id: z.string().length(12),
  user_id: z.string().length(12),
})

export const schoolYearCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
  start_date: z.string().length(10, { message: 'Start date is required' }),
  end_date: z.string().length(10, { message: 'End date is required' }),
})

export const schoolYearUpdateSchema = schoolYearCreateSchema.extend({
  id: z.string(),
})

export const groupCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
  grade: z.string().min(1, { message: 'Grade is required' }),
  school_year_id: z.string().length(12),
})

export const groupUpdateSchema = groupCreateSchema.extend({
  id: z.string(),
})

export const studentCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
  student_group_id: z.string().length(12),
})

export const studentUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
  id: z.string().length(12),
})

export const subjectCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(60),
})

export const subjectUpdateSchema = subjectCreateSchema.extend({
  id: z.string(),
})

export const addStudentToGroupSchema = z.object({
  student_id: z.string().length(12),
  student_group_id: z.string().length(12),
})

export const toggleArchiveStudentSchema = z.object({
  student_id: z.string().length(12),
  archived: z.coerce.number().int().min(0).max(1),
})
export const assignmentCreateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).max(60),
  description: z.string(),
  student_group_id: z.string().length(12, { message: 'Group is required' }),
  type: z.enum(['classwork', 'homework']),
  assigned_date: z.string().nullable(),
  due_date: z.string().nullable(),
  subject_id: z.string().length(12, { message: 'Subject is required' }),
})
export const assignmentUpdateSchema = assignmentCreateSchema.extend({
  id: z.string().length(12),
})

export const runningRecordCreateSchema = z.object({
  student_id: z.string().length(12),
  audio_url: z.string().url().nullable(),
  marked_text: z.string().nullable(),
  text_id: z.string().length(12),
})

export const runningRecordUpdateSchema = z.object({
  id: z.string().length(12),
  student_id: z.string().length(12).optional(),
  audio_url: z.string().url().nullable().optional(),
  marked_text: z.string().nullable().optional(),
  text_id: z.string().length(12).optional(),
  comments: z.string().nullable().optional(),
})

export const runningRecordTextCreateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  source: z.string().nullable(),
  text: z.string().min(1, { message: 'Text is required' }),
  lexile: z.coerce.number().min(0).max(2000).nullable(),
})

export const runningRecordTextUpdateSchema =
  runningRecordTextCreateSchema.extend({
    id: z.string().length(12),
  })

export const wordCreateSchema = z.object({
  words: z.string().min(1, { message: 'Words are required' }),
  existingTagId: z.string().optional(),
  newTagName: z.string().optional(),
})

export const wordUpdateSchema = z.object({
  id: z.string().length(12),
  word: z.string().min(1, { message: 'Words are required' }),
  existingTagId: z.string().optional(),
  newTagName: z.string().optional(),
})

export const wordTagCreateSchema = z.object({
  name: z.string().min(1, { message: 'Tag name is required' }),
})

export const wordTagUpdateSchema = wordTagCreateSchema.extend({
  id: z.string().length(12),
  order_index: z.coerce
    .number()
    .nullable()
    // eslint-disable-next-line unicorn/no-null
    .transform(value => (value === '' ? null : value)),
})

export const wordRemoveTagSchema = z.object({
  id: z.string().length(12),
})

export const wordAttachTagSchema = z.object({
  tag_name: z.string().min(1, { message: 'Tag name is required' }),
  tag_id: z.string().length(12).optional(),
})

export const addParentTagSchema = z.object({
  tag_id: z.string().length(12),
  parent_tag_id: z.string().length(12),
})

export const wordAudioCreateSchema = z.object({
  audio_url: z.string().url().min(1, { message: 'Audio URL is required' }),
  type: z.string().optional(),
  word_id: z.string().length(12),
})
