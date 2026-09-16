// Fixed public upstream only: this is not an arbitrary URL proxy.
export async function onRequestGet(context) {
  const query = new URL(context.request.url).searchParams.get('q')?.trim() || ''
  if (query.length < 2 || query.length > 160) return Response.json({ error: 'Use a search between 2 and 160 characters.' }, { status: 400 })
  const upstream = new URL('https://www.osti.gov/api/v1/records')
  upstream.searchParams.set('search', query)
  upstream.searchParams.set('rows', '40')
  try {
    const response = await fetch(upstream, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) })
    if (!response.ok) return Response.json({ error: 'OSTI is temporarily unavailable. Try Crossref or retry later.' }, { status: 502 })
    return new Response(response.body, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } })
  } catch {
    return Response.json({ error: 'OSTI did not respond in time. Try Crossref or retry later.' }, { status: 504 })
  }
}
