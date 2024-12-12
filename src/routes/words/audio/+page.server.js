import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '$env/static/private'
import { generateUploadSignature } from '$lib/crypto'
import { client, sql } from '$lib/server/data'

const wordsWithoutAudioQuery = sql`
  SELECT w.*
  FROM word w
  LEFT JOIN word_audio wa ON w.id = wa.word_id
  WHERE wa.word_id IS NULL;
`

export async function load() {
  const wordAudioQuery = sql`
    SELECT wa.*, w.word
    FROM word_audio wa
    JOIN word w ON wa.word_id = w.id
    GROUP BY wa.word_id;
  `
  const wordAudioResult = await client.execute(wordAudioQuery)
  const wordAudio = wordAudioResult?.rows || []

  const wordsWithoutAudioResult = await client.execute(wordsWithoutAudioQuery)
  const wordsWithoutAudio = wordsWithoutAudioResult?.rows || []
  return { wordAudio, wordsWithoutAudio }
}

export const actions = {
  prepareUpload: async () => {
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = 'word_audio'
    const recordingTypes = ['super-slow', 'segmented', 'normal']

    const wordsWithoutAudioResult = await client.execute(wordsWithoutAudioQuery)
    const words = wordsWithoutAudioResult?.rows || []

    const signatures = await Promise.all(
      words.map(async word => {
        const typeSignatures = await Promise.all(
          recordingTypes.map(async type => {
            const public_id = `word-${word.word}-${type}-${timestamp}`
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
              type,
              signature,
              public_id,
              timestamp,
            }
          }),
        )

        return {
          wordId: word.id,
          word: word.word,
          recordings: typeSignatures,
        }
      }),
    )

    return {
      success: true,
      signatures,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder,
      apiKey: CLOUDINARY_API_KEY,
    }
  },
}
