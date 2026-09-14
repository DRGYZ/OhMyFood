import { HashRouter, Route, Routes, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { DiscoverPage } from "./discover/DiscoverPage";
import { RestaurantPage } from "./restaurant/RestaurantPage";
import { ReservationPage } from "./reservation/ReservationPage";
import { ConfirmationPage } from "./reservation/ConfirmationPage";
import { SelectionProvider } from "./selection/SelectionContext";
import { SimplePage } from "./SimplePage";
import "./layout/layout.css";
import "./discover/discover.css";
import "./restaurant/restaurant.css";
import "./reservation/reservation.css";

function RouteFocusManager() {
  const location = useLocation();
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    if (previousPathname.current === location.pathname) return;
    previousPathname.current = location.pathname;

    const frame = window.requestAnimationFrame(() => {
      const target = location.pathname === "/" && location.hash === "#restaurants"
        ? document.getElementById("restaurants-title")
        : document.querySelector<HTMLElement>("#main-content h1") ??
          document.getElementById("main-content");
      if (!target) return;
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
}

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
        <RouteFocusManager />
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/restaurants/:slug" element={<RestaurantPage />} />
          <Route
            path="/restaurants/:slug/reservation"
            element={<ReservationPage />}
          />
          <Route
            path="/restaurants/:slug/confirmation"
            element={<ConfirmationPage />}
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
