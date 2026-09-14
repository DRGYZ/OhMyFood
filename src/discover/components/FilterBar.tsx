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

type FilterKey = "cuisine" | "neighborhood" | "dietary";

interface FilterChoicesProps {
  name: FilterKey;
  legend: string;
  value: string;
  allLabel: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function FilterChoices({
  name,
  legend,
  value,
  allLabel,
  options,
  onChange,
}: FilterChoicesProps) {
  const choices = [{ value: "", label: allLabel }, ...options];

  return (
    <fieldset className="filter-choice">
      <legend>{legend}</legend>
      <div className="filter-choice__options">
        {choices.map((option) => (
          <label className="filter-choice__option" key={option.value}>
            <input
              type="radio"
              name={"discover-" + name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
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
        <FilterChoices
          name="cuisine"
          legend="Cuisine"
          value={filters.cuisine}
          allLabel="Toutes les cuisines"
          options={cuisineOptions}
          onChange={(cuisine) => onFilterChange({ cuisine })}
        />
        <FilterChoices
          name="neighborhood"
          legend="Quartier"
          value={filters.neighborhood}
          allLabel="Tout Paris"
          options={neighborhoodOptions}
          onChange={(neighborhood) => onFilterChange({ neighborhood })}
        />
        <FilterChoices
          name="dietary"
          legend="Préférences"
          value={filters.dietary}
          allLabel="Toutes les tables"
          options={dietaryOptions}
          onChange={(dietary) => onFilterChange({ dietary })}
        />
      </div>
    </form>
  );
}
