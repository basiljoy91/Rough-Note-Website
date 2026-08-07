import './HeroSection.css';

const steps = ['Research\nComplete', 'Prototype\nFirst', 'Simplify\nThis Flow', 'Client\nGoals', 'AI\nOpportunity'];

export function HeroSection() {
  return (
    <section className="services-hero reveal-on-scroll" aria-label="What We Build">
      <div className="services-hero__binding" aria-hidden="true" />
      <div className="services-hero__conversation">Every product begins<br />as a conversation.<i /></div>
      <div className="services-hero__version">Version 0.1<i /></div>
      <div className="services-hero__clip" aria-hidden="true"><i /><i /></div>

      <div className="services-hero__idea"><svg viewBox="0 0 94 126" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2"><circle cx="47" cy="45" r="30"/><path d="M36 49c0-12 22-12 22 0 0 10-7 12-7 26H43c0-14-7-16-7-26Zm7 29h8m-8 5h8m-7 5h6M47 8V0M21 20l-7-7M73 20l7-7M12 45H0m94 0H82M21 70l-7 7m59-7 7 7"/><path d="M42 48c2 9 3 12 5 12s4-3 5-12m-10 0c0-4 10-4 10 0"/></g></svg><span>Idea</span></div>
      <svg className="services-hero__arrows" viewBox="0 0 1024 720" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#4e4538" strokeWidth="1.5"><path d="M228 143c19 8 33 16 50 31m-8-17 8 17-19-1"/><path d="M292 328c-13 8-25 18-36 31m3-16-3 16 18-5"/><path d="M623 113c-33-14-65-10-88 1m8-12-8 12 16 2"/><path d="M748 176c14-12 23-20 32-30m-16 1 16-1-5 15"/><path d="M730 330c14 8 26 16 38 29m-17-1 17 1-5-15"/></g></svg>

      <aside className="services-hero__brand-study" aria-label="Logo exploration and colour palette">
        <p>Logo Exploration</p>
        <div className="services-hero__logo-grid"><b>〽</b><b>R</b><b>R</b><b>〽</b><b>R</b><b>〽</b></div>
        <p>Color Palette</p>
        <div className="services-hero__palette"><i /><i /><i /><i /><i /></div>
      </aside>

      <main className="services-hero__main">
        <h1>What We Build</h1>
        <div className="services-hero__underline" />
        <p>We don’t just deliver services.<br />We transform rough ideas into<br />brands, websites, software,<br />AI solutions, and digital experiences<br />designed around your business.</p>
      </main>

      <aside className="services-hero__sketches">
        <div className="services-hero__wireframe"><em>Website Wireframe</em><div className="services-hero__browser"><small>◦ ◦ ◦</small><div /><section><i /><i /><i /></section><footer /></div></div>
        <div className="services-hero__workflow"><em>AI Workflow</em><span>Input</span><b>↓</b><span>AI Engine</span><div><span>Analyze</span><span>Automate</span></div></div>
      </aside>

      <div className="services-hero__research">✓<br /><span>Needs<br />Research</span></div>
      <footer className="services-hero__footer">
        {steps.map((step) => <div className="services-hero__step" key={step}><b>✓</b>{step.split('\n').map((line) => <span key={line}>{line}</span>)}</div>)}
        <div className="services-hero__launch">Launch<br />V1</div>
      </footer>
    </section>
  );
}
