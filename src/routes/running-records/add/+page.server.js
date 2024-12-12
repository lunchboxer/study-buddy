import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '$env/static/private'
import { generateUploadSignature } from '$lib/crypto'
import { client, sql } from '$lib/server/data'
import { error, redirect } from '@sveltejs/kit'

export async function load({ url }) {
  const studentId = url.searchParams.get('studentId')
  const textId = url.searchParams.get('textId')
  if (!(studentId && textId)) {
    return redirect(302, '/running-records')
  }
  const studentResult = await client.execute(
    sql`SELECT * FROM user WHERE id = ${studentId};`,
  )
  if (!studentResult?.rows?.[0]) {
    return error(404, 'Student not found')
  }

  const student = studentResult?.rows?.[0]
  const textResult = await client.execute(
    sql`SELECT * FROM running_record_text WHERE id = ${textId};`,
  )
  if (!textResult?.rows?.[0]) {
    return error(404, 'Text not found')
  }
  const text = textResult?.rows?.[0]
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'running_records_audio'
  const public_id = `running-record-${student.name}-${timestamp}`
  const signingParameters = {
    timestamp,
    public_id,
    folder,
  }

  const signature = await generateUploadSignature(
    CLOUDINARY_API_SECRET,
    signingParameters,
  )

  return {
    student,
    text,
    signature,
    public_id,
    cloudName: CLOUDINARY_CLOUD_NAME,
    folder,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
  }
}
