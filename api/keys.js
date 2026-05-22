export const config = { runtime: 'edge' };

export default async function handler(req) {
  return new Response(JSON.stringify({
    tmdb: process.env.TMDB_KEY || '',
    groq: process.env.GROQ_API_KEY || ''
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}
