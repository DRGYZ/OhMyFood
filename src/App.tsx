import { HashRouter, Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import { DiscoverPage } from "./discover/DiscoverPage";
import { RestaurantPage } from "./restaurant/RestaurantPage";
import { ReservationPlaceholder } from "./restaurant/ReservationPlaceholder";
import { SelectionProvider } from "./selection/SelectionContext";
import { SimplePage } from "./SimplePage";
import "./layout/layout.css";
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
            path="/restaurants/:slug/reservation"
            element={<ReservationPlaceholder />}
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
