export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <a className="wordmark" href="./" aria-label="OhMyFood, accueil">
          <span className="wordmark__name">OhMyFood</span>
          <span className="wordmark__caption">Tables de Paris</span>
        </a>
        <nav aria-label="Navigation principale" className="site-nav">
          <a href="#restaurants">Découvrir les tables</a>
        </nav>
        <span className="site-header__context">
          <span className="context-dot" aria-hidden="true" />
          Paris, France
        </span>
      </div>
    </header>
  );
}
