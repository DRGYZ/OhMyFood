import { Link } from "react-router";
import type { MouseEvent } from "react";

export function SiteHeader() {
  function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
    // HashRouter owns the URL fragment, so focus the in-page target directly.
    event.preventDefault();
    const main = document.getElementById("main-content");
    if (!main) return;
    main.tabIndex = -1;
    main.focus();
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        Aller au contenu principal
      </a>
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
    </>
  );
}
