import { client, sql } from '$lib/data'

export async function GET() {
  const result = await client.execute(sql`SELECT * FROM user;`)
  const users = result.rows || []

  return new Response(JSON.stringify({ users }))
}
