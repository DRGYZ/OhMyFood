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
        <span className="site-footer__brand">OhMyFood</span>
        <p>Quatre tables parisiennes à explorer.</p>
        <p>Choisissez votre table, composez votre menu.</p>
      </div>
    </footer>
  );
}
