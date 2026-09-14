import { useSearchParams } from "react-router";
import { FeaturedRestaurant } from "./components/FeaturedRestaurant";
import { FilterBar } from "./components/FilterBar";
import { RestaurantCard } from "./components/RestaurantCard";
import { SiteHeader } from "../layout/SiteHeader";
import { SiteFooter } from "../layout/SiteFooter";
import {
  filterRestaurants,
  parseFilters,
  filtersToSearchParams,
  type DiscoverFilters,
} from "./filters";
import { restaurants } from "../data/restaurants";
import "./discover.css";

const emptyFilters: DiscoverFilters = {
  q: "",
  cuisine: "",
  neighborhood: "",
  dietary: "",
};

export function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);

  function changeFilters(
    patch: Partial<DiscoverFilters>,
    mode: "push" | "replace",
  ) {
    const next = { ...filters, ...patch };
    setSearchParams(filtersToSearchParams(next), { replace: mode === "replace" });
  }

  function resetFilters() {
    changeFilters(emptyFilters, "push");
    document.getElementById("restaurant-search")?.focus();
  }

  const filtered = filterRestaurants(restaurants, filters);
  const hasActiveFilters = Object.values(filters).some((value) => value.trim());
  const featured = !hasActiveFilters
    ? filtered.find((restaurant) => restaurant.featured)
    : undefined;
  const listing = featured
    ? filtered.filter((restaurant) => restaurant.id !== featured.id)
    : filtered;

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="discover-page">
        <div className="page-shell">
          <div className={
            "discover-opening" +
            (hasActiveFilters ? " discover-opening--filtered" : "")
          }>
            <section className="intro" aria-labelledby="discover-title">
              <div>
                <p className="eyebrow">
                  <span className="eyebrow__line" aria-hidden="true" />
                  Guide des tables · Paris
                </p>
                <h1 id="discover-title">
                  À table, <em>Paris.</em>
                </h1>
              </div>
              <p className="intro__lead">
                Quatre adresses, quatre façons de savourer la ville. Trouvez celle
                qui vous ressemble.
              </p>
            </section>

            <FilterBar
              filters={filters}
              onSearchChange={(q) => changeFilters({ q }, "replace")}
              onFilterChange={(patch) => changeFilters(patch, "push")}
            />

            {featured && <FeaturedRestaurant restaurant={featured} />}
          </div>

          <section
            className="restaurants-section"
            id="restaurants"
            aria-labelledby="restaurants-title"
          >
            <div className="section-heading restaurants-section__heading">
              <div>
                <span className="eyebrow">
                  {hasActiveFilters ? "Votre sélection" : "Poursuivre la découverte"}
                </span>
                <h2 id="restaurants-title">
                  {hasActiveFilters ? "Les tables trouvées" : "D'autres tables à découvrir"}
                </h2>
              </div>
              <p className="results-count" aria-live="polite" aria-atomic="true">
                {featured
                  ? listing.length + " autres tables"
                  : listing.length + " " + (listing.length === 1 ? "adresse" : "adresses")}
              </p>
            </div>

            {hasActiveFilters && filtered.length > 0 && (
              <div className="results-context">
                <p>
                  {filtered.length === 1
                    ? "Une adresse correspond à votre recherche."
                    : "Voici les adresses qui correspondent à votre recherche."}
                </p>
                <button
                  type="button"
                  className="text-button"
                  onClick={resetFilters}
                >
                  Effacer les filtres
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="empty-results">
                <span className="empty-results__mark" aria-hidden="true">
                  ∅
                </span>
                <h3>Aucune table trouvée</h3>
                <p>
                  Essayez un autre quartier, une cuisine différente ou une
                  recherche plus courte.
                </p>
                <button
                  type="button"
                  className="primary-link"
                  onClick={resetFilters}
                >
                  Réinitialiser la recherche
                </button>
              </div>
            ) : (
              <div
                className={
                  "restaurant-grid" +
                  (hasActiveFilters ? " restaurant-grid--filtered" : "") +
                  (listing.length === 1 ? " restaurant-grid--single" : "")
                }
              >
                {listing.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    index={featured ? index + 2 : index + 1}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
