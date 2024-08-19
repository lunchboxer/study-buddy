import { client, sql } from '$lib/data'
import { hashPassword } from '$lib/crypto'

export async function GET() {
  console.log(await hashPassword('password'))
  const result = await client.execute(sql`SELECT * FROM user;`)
  const users = result.rows || []
  return new Response(JSON.stringify({ users }))
}
