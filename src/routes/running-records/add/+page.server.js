import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '$env/static/private'
import { client, sql } from '$lib/data'
import { error, redirect } from '@sveltejs/kit'
import { v2 as cloudinary } from 'cloudinary'

export async function load({ url }) {
  const studentId = url.searchParams.get('studentId')
  const textId = url.searchParams.get('textId')
  if (!(studentId && textId)) {
    return redirect(302, '/running-records')
  }
  const studentResult = await client.execute(
    sql`SELECT * FROM student WHERE id = ${studentId};`,
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
  // generate signature for uplaod to cloudinary
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  })
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'running_records_audio'
  const public_id = `running-record-${student.name}-${timestamp}`
  const signingParameters = {
    timestamp,
    public_id,
    folder,
  }

  const signature = cloudinary.utils.api_sign_request(
    signingParameters,
    CLOUDINARY_API_SECRET,
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
