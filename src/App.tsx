import { HashRouter, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { DiscoverPage } from "./discover/DiscoverPage";
import { SiteHeader } from "./discover/components/SiteHeader";
import { RestaurantPage } from "./restaurant/RestaurantPage";
import { SelectionProvider } from "./selection/SelectionContext";
import { SimplePage } from "./SimplePage";
import "./discover/discover.css";
import "./restaurant/restaurant.css";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#restaurants") {
      document.getElementById("restaurants")?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return null;
}

export function App() {
  return (
    <HashRouter>
      <SelectionProvider>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/restaurants/:slug" element={<RestaurantPage />} />
          <Route
            path="/reservation"
            element={
              <SimplePage
                eyebrow="OhMyFood · prochaine étape"
                title="Votre réservation"
                message="Votre sélection reste disponible pendant cette visite. Le parcours de réservation sera créé dans la prochaine phase."
              />
            }
          />
          <Route
            path="*"
            element={
              <SimplePage
                eyebrow="OhMyFood · page introuvable"
                title="Cette page n'existe pas"
                message="Retrouvez les quatre tables parisiennes depuis la découverte."
              />
            }
          />
        </Routes>
      </SelectionProvider>
    </HashRouter>
  );
}
