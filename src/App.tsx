import { useEffect, useState } from "react";
import Research from "./Research";
import { keywordHits, downloadText, readTextFile } from "./analysis";
import { technologies, sectors } from "./data";
import type { Technology } from "./data";

function App() {
  const [page, setPage] = useState("Discover");
  const [sector, setSector] = useState("All energy");
  const [query, setQuery] = useState("");
  const [researchTopic, setResearchTopic] = useState("energy storage");
  const [selected, setSelected] = useState<Technology | null>(null);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("current-saved") || "[]",
      );
      return Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [analyzed, setAnalyzed] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!selected) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLButtonElement>(".close-button")?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
      if (e.key !== "Tab") return;
      const controls = document.querySelectorAll<HTMLElement>(
        ".modal button, .modal a[href]",
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [selected]);
  async function importText(file?: File) {
    if (!file) return;
    try {
      const result = await readTextFile(file);
      setInput(result.text);
      setAnalyzed("");
      setNotice(
        result.truncated
          ? "Imported the first 50,000 characters."
          : `Imported ${file.name}. Ready to analyze.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "This file could not be read. Try pasting its text instead.",
      );
    }
  }
  function save(id: string) {
    const next = saved.includes(id)
      ? saved.filter((s) => s !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("current-saved", JSON.stringify(next));
    } catch {
      setNotice("Saved for this session. Browser storage is unavailable.");
    }
  }
  const visible = technologies.filter(
    (t) =>
      (sector === "All energy" || t.sector === sector) &&
      (page !== "Watchlist" || saved.includes(t.id)) &&
      `${t.name} ${t.description} ${t.keywords.join(" ")} ${t.applications.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const matches = technologies
    .map((t) => ({ ...t, hits: keywordHits(analyzed, t.keywords) }))
    .filter((t) => t.hits.length);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Current home">
          <span className="brand-symbol">ϟ</span>current
          <span className="brand-dot">.</span>
        </a>
        <p className="workspace-label">ENERGY INTELLIGENCE</p>
        <nav>
          {[
            ["Discover", "◈"],
            ["Research", "↗"],
            ["Keyword lab", "⌕"],
            ["Watchlist", "☆"],
            ["Sources", "⊞"],
          ].map(([name, icon]) => (
            <button
              className={page === name ? "nav-item active" : "nav-item"}
              key={name}
              onClick={() => {
                setPage(name);
                setQuery("");
                setSector("All energy");
              }}
            >
              <span>{icon}</span>
              {name}
              {name === "Watchlist" && <small>{saved.length}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="mini-orbit">✳</span>
          <strong>
            A clearer view of
            <br />
            what comes next.
          </strong>
          <p>
            Connect the research.
            <br />
            Discover the possibilities.
          </p>
          <span className="note-line" />
        </div>
        <div className="sidebar-bottom">
          <span className="status-dot" /> Public knowledge. Open possibilities.
          <small>BUILT LIVE · SEPTEMBER 2026</small>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span>
            Workspace <span className="slash">/</span> <strong>{page}</strong>
          </span>
          <div className="topbar-right">
            <span className="demo-badge">
              <span className="status-dot" /> Exploration workspace
            </span>
            <span className="avatar">C</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <p className="eyebrow">THE ENERGY TRANSITION, IN FOCUS</p>
              <h1>
                {page === "Discover"
                  ? "Find your next breakthrough."
                  : page === "Research"
                    ? "Discover the signals that matter."
                    : page === "Keyword lab"
                      ? "Turn information into insight."
                      : page === "Watchlist"
                        ? "Your radar. Your priorities."
                        : "Built on open knowledge."}
              </h1>
              <p className="subtitle">
                {page === "Discover"
                  ? "Explore the technologies shaping energy. Connect ideas to real-world applications."
                  : page === "Keyword lab"
                    ? "Extract energy keywords from articles, abstracts, or notes you paste below."
                    : page === "Watchlist"
                      ? "Keep the technologies that matter to you in one place."
                      : "Trace every idea back to its source. Explore public energy research."}
              </p>
            </div>
            <button
              aria-label="Analyze text"
              className="button secondary"
              onClick={() => {
                setPage("Keyword lab");
                setQuery("");
              }}
            >
              ⌕ <span>Analyze text</span>
            </button>
          </div>
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
          {page === "Discover" && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <span className="pill">THE OPPORTUNITY LANDSCAPE</span>
                  <h2>
                    Big shifts start with
                    <br />
                    <em>small signals.</em>
                  </h2>
                  <p>
                    Explore emerging energy technologies, uncover useful
                    connections, and find where research meets opportunity.
                  </p>
                  <button
                    className="button lime"
                    onClick={() => setPage("Research")}
                  >
                    Explore your research <span>↗</span>
                  </button>
                </div>
                <div className="energy-orbit" aria-hidden="true">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="orbit orbit-three" />
                  <span className="orbit-core">ϟ</span>
                  <span className="orbit-tag tag-one">✣ WIND</span>
                  <span className="orbit-tag tag-two">▥ STORAGE</span>
                  <span className="orbit-tag tag-three">☼ SOLAR</span>
                  <span className="orbit-point p1" />
                  <span className="orbit-point p2" />
                  <div className="orbit-caption">
                    CONNECTED IDEAS. CLEANER ENERGY.
                  </div>
                </div>
              </section>
              <section className="stats">
                <div>
                  <span>Technology pathways</span>
                  <strong>
                    06 <small>across the energy landscape</small>
                  </strong>
                </div>
                <div>
                  <span>Potential applications</span>
                  <strong>
                    18 <small>ideas to investigate</small>
                  </strong>
                </div>
                <div>
                  <span>Your watchlist</span>
                  <strong>
                    {String(saved.length).padStart(2, "0")}{" "}
                    <small>technologies saved</small>
                  </strong>
                </div>
              </section>
            </>
          )}
          {(page === "Discover" || page === "Watchlist") && (
            <section className="explorer">
              <div className="section-heading">
                <div>
                  <h2>
                    {page === "Watchlist"
                      ? "Saved technologies"
                      : "Technology radar"}{" "}
                    <span className="count">{visible.length}</span>
                  </h2>
                  <p>
                    Curated starting points · applications are possibilities,
                    not forecasts
                  </p>
                </div>
                <label className="search">
                  <span>⌕</span>
                  <input
                    aria-label="Search technologies"
                    placeholder="Search technologies, applications…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>
              <div className="filters">
                {sectors.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={sector === s ? "filter selected" : "filter"}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="card-grid">
                {visible.map((t) => (
                  <article className="tech-card" key={t.id}>
                    <div className="card-top">
                      <span className={`tech-icon icon-${t.id}`}>{t.icon}</span>
                      <button
                        className={`save-button ${saved.includes(t.id) ? "is-saved" : ""}`}
                        aria-label={`${saved.includes(t.id) ? "Unsave" : "Save"} ${t.name}`}
                        onClick={() => save(t.id)}
                      >
                        {saved.includes(t.id) ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="card-category">
                      {t.sector} <span>·</span> {t.stage}
                    </div>
                    <h3>
                      <button onClick={() => setSelected(t)}>{t.name}</button>
                    </h3>
                    <p>{t.description}</p>
                    <div className="tags">
                      {t.applications.slice(0, 2).map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                    </div>
                    <button
                      className="card-footer"
                      onClick={() => setSelected(t)}
                    >
                      <span>Explore technology</span>
                      <span>↗</span>
                    </button>
                  </article>
                ))}
              </div>
              {!visible.length && (
                <div className="empty">
                  <span>⌕</span>
                  <h3>
                    {page === "Watchlist" && !saved.length
                      ? "Start building your watchlist"
                      : "No matching technologies"}
                  </h3>
                  <p>
                    {page === "Watchlist" && !saved.length
                      ? "Tap the star on any technology to save it here."
                      : "Try a broader keyword or another energy category."}
                  </p>
                  <button
                    aria-label="Analyze text"
                    className="button secondary"
                    onClick={() => {
                      setPage("Discover");
                      setQuery("");
                      setSector("All energy");
                    }}
                  >
                    Explore all technologies
                  </button>
                </div>
              )}
            </section>
          )}
          <div hidden={page !== "Research"}>
            <Research
              key={researchTopic}
              initialQuery={researchTopic}
              onAnalyze={(text) => {
                setInput(text.slice(0, 50000));
                setAnalyzed(text.slice(0, 50000));
                setPage("Keyword lab");
              }}
            />
          </div>
          {page === "Keyword lab" && (
            <section className="lab-layout">
              <div className="panel">
                <p className="eyebrow">01 / ADD YOUR SOURCE TEXT</p>
                <h2>What are you researching?</h2>
                <p className="muted">
                  Paste text from a public article or research abstract.
                  Analysis runs in your browser.
                </p>
                <label className="file-import">
                  ↑ Import text file
                  <input
                    type="file"
                    accept=".txt,.md,text/plain,text/markdown"
                    onChange={(e) => {
                      void importText(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <label className="field-label" htmlFor="source-text">
                  Article, abstract, or notes
                </label>
                <textarea
                  id="source-text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your energy research here…"
                  maxLength={50000}
                />
                <div className="form-bottom">
                  <button
                    className="text-button"
                    onClick={() =>
                      setInput(
                        "Researchers are exploring sodium batteries and flow battery storage for renewable grid balancing. Solar photovoltaic generation, demand response, and microgrid control can help communities build more resilient energy systems.",
                      )
                    }
                  >
                    Try example text
                  </button>
                  <span>{input.length.toLocaleString()} / 50,000</span>
                </div>
                <button
                  className="button dark"
                  disabled={!input.trim()}
                  onClick={() => setAnalyzed(input)}
                >
                  Extract keywords & applications ↗
                </button>
              </div>
              <div className="panel results-panel">
                <p className="eyebrow">02 / CONNECT THE SIGNALS</p>
                <h2>
                  {analyzed
                    ? `${matches.length} technology connections`
                    : "Your insights appear here"}
                </h2>
                <p className="muted">
                  Transparent keyword matching connects your text to technology
                  pathways and possible applications.
                </p>
                {analyzed && (
                  <button
                    className="button secondary"
                    onClick={() =>
                      downloadText(
                        "current-keyword-analysis.md",
                        `# Current keyword analysis\n\nDictionary-based connections; application ideas require validation.\n\n${matches.map((t) => `## ${t.name}\nMatched: ${t.hits.join(", ")}\nApplications: ${t.applications.join("; ")}\nSource: ${t.url}`).join("\n\n")}`,
                      )
                    }
                  >
                    ↓ Export analysis
                  </button>
                )}
                {analyzed && input !== analyzed && (
                  <p className="notice">
                    Text changed. Extract again to update these results.
                  </p>
                )}
                {analyzed ? (
                  matches.length ? (
                    matches.map((t) => (
                      <div className="match" key={t.id}>
                        <span className="card-category">
                          {t.hits.length} matched keywords
                        </span>
                        <h3>{t.name}</h3>
                        <div className="tags">
                          {t.hits.map((h) => (
                            <span key={h}>{h}</span>
                          ))}
                        </div>
                        <p>
                          <strong>Explore applications:</strong>{" "}
                          {t.applications.join(" · ")}
                        </p>
                        <button
                          className="text-button"
                          onClick={() => setSelected(t)}
                        >
                          View pathway ↗
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty">
                      <h3>No energy keywords found</h3>
                      <p>
                        Try text mentioning solar, storage, hydrogen, wind,
                        grid, or geothermal.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="lab-illustration" aria-hidden="true">
                    ⌕<span>Information → connections → possibilities</span>
                  </div>
                )}
              </div>
            </section>
          )}
          {page === "Sources" && (
            <section className="panel">
              <h2>Follow the evidence</h2>
              <div className="api-sources">
                <a
                  href="https://www.crossref.org/documentation/retrieve-metadata/rest-api/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>Crossref ↗</strong>
                  <span>
                    Scholarly titles, dates, DOI links, and available abstracts.
                    Direct public API.
                  </span>
                </a>
                <a
                  href="https://www.osti.gov/api/v1/docs"
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>OSTI ↗</strong>
                  <span>
                    U.S. Department of Energy research metadata and abstracts.
                    Public API.
                  </span>
                </a>
              </div>
              <p className="muted">
                Technology descriptions are editorial starting points. Visit the
                original source to evaluate maturity, costs, and feasibility.
              </p>
              {technologies.map((t) => (
                <a
                  className="source-row"
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="tech-icon">{t.icon}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.source} · Public information</small>
                  </div>
                  <span>↗</span>
                </a>
              ))}
              <div className="methodology">
                <strong>About this first version</strong>
                <p>
                  The radar is a curated technology directory. Keyword
                  extraction uses a local, explainable dictionary. Research
                  search connects to Crossref and OSTI public APIs. Charts
                  summarize up to 40 relevance-ranked records, not the entire
                  literature. No generative model is used: connections and
                  application ideas use an explainable technology dictionary. No
                  accounts or API keys required.
                </p>
              </div>
            </section>
          )}
          <footer>
            <span>
              <span className="brand-tiny">ϟ</span> current / Energy
              intelligence for the curious.
            </span>
            <span>Open sources. Human perspective.</span>
          </footer>
        </main>
      </div>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelected(null);
            }}
          >
            <button
              className="close-button"
              aria-label="Close details"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <span className="tech-icon large">{selected.icon}</span>
            <p className="eyebrow">{selected.sector} / TECHNOLOGY BRIEF</p>
            <h2 id="detail-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <h3>Where it could make a difference</h3>
            <ul>
              {selected.applications.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <h3>Research keywords</h3>
            <div className="tags">
              {selected.keywords.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </div>
            <p className="muted">
              Editorial overview. Applications require project-specific
              technical and economic validation.
            </p>
            <div className="modal-actions">
              <button
                className="button lime"
                onClick={() => {
                  setResearchTopic(selected.keywords[0]);
                  setSelected(null);
                  setPage("Research");
                }}
              >
                Find live research ↗
              </button>
              <a
                className="button dark"
                href={selected.url}
                target="_blank"
                rel="noreferrer"
              >
                Read the source ↗
              </a>
              <button
                className="button secondary"
                onClick={() => save(selected.id)}
              >
                {saved.includes(selected.id) ? "★ Saved" : "☆ Add to watchlist"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
