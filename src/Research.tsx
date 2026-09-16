import { useState } from 'react'
import { technologies } from './data'

export type Paper = { id: string; title: string; abstract: string; date: string; publisher: string; url: string; source: string }
type CrossrefItem = { DOI?: string; title?: string[]; abstract?: string; publisher?: string; published?: { 'date-parts'?: number[][] } }
type OstiItem = { osti_id?: string; title?: string; description?: string; publication_date?: string; research_orgs?: string[] }
export function plainText(value: string) { return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }
export function keywordHits(text: string, keywords: string[]) { return keywords.filter(k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)) }
export function downloadText(filename: string, text: string) { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
export default function Research({ onAnalyze }: { onAnalyze: (text: string) => void }) {
  const [query, setQuery] = useState('energy storage')
  const [source, setSource] = useState('Crossref')
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState('')
  const [loadedSource, setLoadedSource] = useState('')
  const [retrieved, setRetrieved] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('relevance')
  async function search() {
    if (query.trim().length < 2 || loading) return
    setLoading(true); setError(''); setPapers([]); setSearched(''); setFilter('All')
    try {
      let results: Paper[]
      if (source === 'Crossref') {
        const url = new URL('https://api.crossref.org/works')
        url.searchParams.set('query', query.trim()); url.searchParams.set('rows', '40')
        url.searchParams.set('filter', `from-pub-date:2020-01-01,until-pub-date:${new Date().toISOString().slice(0, 10)}`)
        url.searchParams.set('select', 'DOI,title,abstract,publisher,published')
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
        if (!response.ok) throw new Error(response.status === 429 ? 'Crossref is busy. Please wait a moment and try again.' : 'Crossref is unavailable. Try OSTI or retry later.')
        const data = await response.json()
        if (!Array.isArray(data.message?.items)) throw new Error('Crossref returned an unexpected response. Please retry.')
        results = (data.message.items as CrossrefItem[]).filter(p => p.DOI && p.title?.[0]).map(p => ({ id: p.DOI!, title: plainText(p.title![0]), abstract: plainText(p.abstract || ''), date: (p.published?.['date-parts']?.[0] || []).map((v, i) => i ? String(v).padStart(2, '0') : String(v)).join('-'), publisher: p.publisher || 'Publisher not listed', url: `https://doi.org/${encodeURIComponent(p.DOI!)}`, source: 'Crossref' }))
      } else {
        const response = await fetch(`/api/osti?q=${encodeURIComponent(query.trim())}`, { signal: AbortSignal.timeout(20000) })
        if (!response.ok) throw new Error('OSTI is temporarily unavailable. Try Crossref or retry later.')
        if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The OSTI connector is not available on this host yet. Crossref search works directly.')
        const data: unknown = await response.json()
        if (!Array.isArray(data)) throw new Error('OSTI returned an unexpected response. Please retry.')
        results = (data as OstiItem[]).filter(p => p.osti_id && p.title).map(p => ({ id: p.osti_id!, title: plainText(p.title!), abstract: plainText(p.description || ''), date: (p.publication_date || '').slice(0, 10), publisher: p.research_orgs?.[0] || 'OSTI research record', url: `https://www.osti.gov/biblio/${encodeURIComponent(p.osti_id!)}`, source: 'OSTI' }))
      }
      setPapers([...new Map(results.map(p => [p.id, p])).values()]); setSearched(query.trim()); setLoadedSource(source); setRetrieved(new Date().toLocaleString())
    } catch (e) { setError(e instanceof Error && e.name !== 'TimeoutError' ? e.message : 'The source took too long to respond. Please retry or choose the other source.') }
    finally { setLoading(false) }
  }
  const signals = technologies.map(t => ({ ...t, count: papers.filter(p => keywordHits(`${p.title} ${p.abstract}`, t.keywords).length).length })).sort((a, b) => b.count - a.count)
  const dated = papers.filter(p => /^\d{4}/.test(p.date))
  const years = [...new Set(dated.map(p => p.date.slice(0, 4)))].sort()
  const yearCounts = years.map(year => ({ year, count: dated.filter(p => p.date.startsWith(year)).length }))
  const shown = papers.filter(p => filter === 'All' || keywordHits(`${p.title} ${p.abstract}`, technologies.find(t => t.sector === filter)?.keywords || []).length).sort((a,b) => sort === 'newest' ? b.date.localeCompare(a.date) : 0)
  function exportBrief() { downloadText('current-research-brief.md', `# Current research brief\n\nQuery: ${searched}\nSource: ${loadedSource}\nRetrieved: ${retrieved}\nSample: ${papers.length} relevance-ranked records; not a measure of market growth.\n\n## Technology signals\n${signals.map(s => `- ${s.name}: ${s.count} matching records. Potential applications: ${s.applications.join(', ')}.`).join('\n')}\n\n## Evidence\n${papers.map(p => `- ${p.title} (${p.date || 'Date unknown'}) — ${p.url}`).join('\n')}`) }
  return <section className="research"><div className="panel research-search"><div><p className="eyebrow">LIVE PUBLIC RESEARCH</p><h2>Follow the signal to its source.</h2><p className="muted">Search publications, extract technology signals, and explore potential applications.</p></div><form onSubmit={e => { e.preventDefault(); void search() }}><label className="research-query">Research topic<input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. perovskite solar cells" minLength={2} maxLength={160} required disabled={loading}/></label><label>Public source<select value={source} onChange={e => setSource(e.target.value)} disabled={loading}><option>Crossref</option><option>OSTI</option></select></label><button className="button dark" disabled={loading || query.trim().length < 2}>{loading ? 'Searching…' : 'Discover research ↗'}</button></form><div className="research-suggestions"><span>Try a direction</span>{['energy storage', 'green hydrogen', 'perovskite solar', 'smart grid'].map(q => <button key={q} disabled={loading} onClick={() => setQuery(q)}>{q} ↗</button>)}</div></div>
    <div aria-live="polite">{loading && <div className="notice loading"><span className="status-dot"/> Searching {source} for public research…</div>}{error && <div className="notice error" role="alert">{error}</div>}</div>
    {!searched && !loading && !error && <div className="research-welcome"><span>↗</span><h3>Your next connection is one search away.</h3><p>Real publications. Linked evidence. No account required.</p><div className="source-pills"><span>Crossref · Scholarly metadata</span><span>OSTI · U.S. energy research</span></div></div>}
    {searched && <><div className="section-heading research-heading"><div><h2>{papers.length} research signals <span className="count">{loadedSource}</span></h2><p>“{searched}” · Retrieved {retrieved}</p></div><button className="button secondary" disabled={!papers.length} onClick={exportBrief}>↓ Export research brief</button></div>{papers.length > 0 && <><div className="insight-grid"><div className="panel"><p className="eyebrow">TECHNOLOGY CONNECTIONS</p><h3>What appears in this research?</h3>{signals.map(s => <button className="signal-row" key={s.id} onClick={() => setFilter(s.sector)}><span>{s.sector}</span><span className="signal-track"><span style={{ width: `${s.count / papers.length * 100}%` }}/></span><strong>{s.count}</strong></button>)}<p className="chart-note">Records matching curated keywords in titles and available abstracts. A record can match multiple technologies.</p></div><div className="panel"><p className="eyebrow">PUBLICATION TIMELINE</p><h3>The research behind the signals</h3><div className="bar-chart" role="img" aria-label={yearCounts.map(y => `${y.year}: ${y.count} records`).join(', ')}>{yearCounts.map(y => <div className="bar-column" key={y.year}><span>{y.count}</span><div className="bar-track"><div style={{height:`${y.count / Math.max(...yearCounts.map(c=>c.count),1)*100}%`}}/></div><small>{y.year}</small></div>)}</div><p className="chart-note">Publication dates in this relevance-ranked sample, not a complete time series or evidence of market growth. {papers.length - dated.length} undated records.</p></div></div><div className="application-strip"><div><p className="eyebrow">FROM SIGNAL TO POSSIBILITY</p><h3>{signals[0].count ? signals[0].name : 'Broaden your energy research'}</h3><p>{signals[0].count ? `Most frequent pathway in this sample (${signals[0].count} records). Possible applications to investigate:` : 'No dictionary matches in these records. Try a more specific energy topic.'}</p></div>{signals[0].count > 0 && <div className="tags">{signals[0].applications.map(a => <span key={a}>{a}</span>)}</div>}</div></>}
    <div className="results-toolbar"><div className="filters">{['All', ...signals.filter(s => s.count).map(s => s.sector)].map(s => <button className={filter===s?'filter selected':'filter'} key={s} onClick={()=>setFilter(s)}>{s}</button>)}</div><label>Sort <select aria-label="Sort research" value={sort} onChange={e=>setSort(e.target.value)}><option value="relevance">Source relevance</option><option value="newest">Newest first</option></select></label></div>
    <div className="paper-list">{shown.map(p => { const matches = technologies.filter(t => keywordHits(`${p.title} ${p.abstract}`, t.keywords).length); return <article className="paper" key={p.id}><div className="paper-meta"><span>{p.source}</span> {p.date || 'Date not listed'} · {p.publisher}</div><h3><a href={p.url} target="_blank" rel="noreferrer">{p.title} ↗</a></h3><p>{p.abstract ? p.abstract.slice(0, 360) + (p.abstract.length > 360 ? '…' : '') : 'Abstract not supplied by this source. Open the publication to read more.'}</p><div className="paper-bottom"><div className="tags">{matches.map(t => <span key={t.id}>{t.sector}</span>)}</div><button className="text-button" onClick={() => onAnalyze(`${p.title}\n\n${p.abstract}\n\nSource: ${p.url}`)}>Analyze {p.abstract ? 'abstract' : 'title'} ↗</button></div></article> })}</div>{!shown.length && <div className="empty"><h3>No matching publications</h3><p>Try another query, source, or technology filter.</p></div>}</>}
  </section>
}

