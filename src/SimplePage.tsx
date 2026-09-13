import { Link } from "react-router";
import { SiteHeader } from "./discover/components/SiteHeader";

interface SimplePageProps {
  eyebrow: string;
  title: string;
  message: string;
}

export function SimplePage({ eyebrow, title, message }: SimplePageProps) {
  return (
    <>
      <SiteHeader />
      <main className="pending-page page-shell" id="main-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="primary-link" to="/">
          Découvrir les tables <span aria-hidden="true">↗</span>
        </Link>
      </main>
    </>
  );
}
