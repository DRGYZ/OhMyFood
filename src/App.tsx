import { useEffect, useState } from "react";
import { DiscoverPage } from "./discover/DiscoverPage";
import { SiteHeader } from "./discover/components/SiteHeader";
import { restaurantBySlug } from "./discover/restaurants";
import "./discover/discover.css";

export function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (hash === "#restaurants") {
      document.getElementById("restaurants")?.scrollIntoView();
    } else if (hash.startsWith("#/restaurants/")) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [hash]);

  const match = /^#\/restaurants\/([a-z0-9-]+)$/.exec(hash);
  if (!match) return <DiscoverPage />;

  const restaurant = restaurantBySlug(match[1]);

  return (
    <>
      <SiteHeader />
      <main className="pending-page page-shell" id="main-content">
        <p className="eyebrow">OhMyFood · prochaine étape</p>
        <h1>{restaurant ? restaurant.name : "Cette table"}</h1>
        <p>
          La fiche détaillée de cette adresse arrive dans la prochaine phase du
          projet. La sélection reste disponible pour continuer à explorer.
        </p>
        <a className="primary-link" href="#restaurants">
          Retour aux tables <span aria-hidden="true">↗</span>
        </a>
      </main>
    </>
  );
}
