import { Link } from "react-router";

export function SiteFooter({
  selectionClearance = false,
}: {
  selectionClearance?: boolean;
}) {
  return (
    <footer
      className={"site-footer" + (selectionClearance ? " site-footer--selection-clearance" : "")}
    >
      <div className="site-footer__inner page-shell">
        <div className="site-footer__identity">
          <span className="site-footer__brand">OhMyFood</span>
          <p className="site-footer__tagline">
            Une sélection de tables parisiennes,
            <br />
            pensée pour prendre le temps de choisir.
          </p>
        </div>
        <Link className="site-footer__link" to="/#restaurants">
          Les tables <span aria-hidden="true">→</span>
        </Link>
      </div>
    </footer>
  );
}
