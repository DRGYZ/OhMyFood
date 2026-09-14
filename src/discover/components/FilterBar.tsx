import { useState } from "react";
import {
  cuisineOptions,
  dietaryOptions,
  neighborhoodOptions,
} from "../../data/restaurants";
import type { DiscoverFilters } from "../filters";

interface FilterBarProps {
  filters: DiscoverFilters;
  onSearchChange: (value: string) => void;
  onFilterChange: (patch: Partial<DiscoverFilters>) => void;
}

export function FilterBar({
  filters,
  onSearchChange,
  onFilterChange,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const activeFilters = [filters.cuisine, filters.neighborhood, filters.dietary].filter(
    Boolean,
  ).length;

  return (
    <form
      className="filter-bar"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="filter-bar__top">
        <div className="search-field">
          <label htmlFor="restaurant-search">Une table, un quartier, une envie</label>
          <div className="search-field__control">
            <span className="search-glyph" aria-hidden="true" />
            <input
              id="restaurant-search"
              type="search"
              value={filters.q}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nom, cuisine ou quartier…"
              autoComplete="off"
            />
          </div>
        </div>
        <button
          className="filter-bar__toggle"
          data-active={activeFilters > 0}
          type="button"
          aria-expanded={expanded}
          aria-controls="discover-filters"
          onClick={() => setExpanded((open) => !open)}
        >
          Filtres{activeFilters ? " (" + activeFilters + ")" : ""}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </div>

      <div
        className={"filter-bar__fields" + (expanded ? " filter-bar__fields--open" : "")}
        id="discover-filters"
      >
        <label className="select-field" data-selected={Boolean(filters.cuisine)}>
          <span>Cuisine</span>
          <select
            value={filters.cuisine}
            onChange={(event) => onFilterChange({ cuisine: event.target.value })}
          >
            <option value="">Toutes les cuisines</option>
            {cuisineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field" data-selected={Boolean(filters.neighborhood)}>
          <span>Quartier</span>
          <select
            value={filters.neighborhood}
            onChange={(event) =>
              onFilterChange({ neighborhood: event.target.value })
            }
          >
            <option value="">Tout Paris</option>
            {neighborhoodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="select-field" data-selected={Boolean(filters.dietary)}>
          <span>Préférences</span>
          <select
            value={filters.dietary}
            onChange={(event) => onFilterChange({ dietary: event.target.value })}
          >
            <option value="">Toutes les tables</option>
            {dietaryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}
