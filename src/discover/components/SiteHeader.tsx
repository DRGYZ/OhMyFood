import { Link } from "react-router";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <Link className="wordmark" to="/" aria-label="OhMyFood, accueil">
          <span className="wordmark__name">OhMyFood</span>
          <span className="wordmark__caption">Tables de Paris</span>
        </Link>
        <nav aria-label="Navigation principale" className="site-nav">
          <Link to="/#restaurants">Découvrir les tables</Link>
        </nav>
        <span className="site-header__context">
          <span className="context-dot" aria-hidden="true" />
          Paris, France
        </span>
      </div>
    </header>
  );
}
