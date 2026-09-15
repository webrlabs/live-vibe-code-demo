function App() {
  return (
    <div className="page">
      <header className="masthead">
        <a className="brand" href="/" aria-label="Live AI App Challenge home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>LIVE AI<br />APP CHALLENGE</span>
        </a>
        <span className="session-label">An experiment. Built together.</span>
      </header>
      <main>
        <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> THE LIVE EXPERIMENT</p>
        <h1>This application<br />does not exist <span className="yet">yet.</span></h1>
        <p className="intro">
          During today's presentation, AI will build it from an idea
          suggested by <strong>this audience.</strong>
        </p>
        <section className="waiting" aria-labelledby="waiting-title">
          <div className="waiting-icon" aria-hidden="true"><span /></div>
          <div>
            <h2 id="waiting-title">Waiting for an idea...</h2>
            <p>You bring the what. AI builds the how.</p>
          </div>
          <span className="waiting-arrow" aria-hidden="true">↗</span>
        </section>
        <ol className="steps" aria-label="How the challenge works">
          <li><span>01</span> Your idea</li>
          <li><span>02</span> AI builds it</li>
          <li><span>03</span> Try it here</li>
        </ol>
      </main>
      <footer>
        <span>From a blank page to a real app.</span>
        <span>Keep this page open. Refresh after the reveal.</span>
      </footer>
    </div>
  )
}

export default App
