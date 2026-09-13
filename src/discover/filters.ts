import {
  cuisineLabel,
  cuisineOptions,
  dietaryOptions,
  neighborhoodOptions,
  type Restaurant,
} from "./restaurants";

export interface DiscoverFilters {
  q: string;
  cuisine: string;
  neighborhood: string;
  dietary: string;
}

const knownValues: Record<"cuisine" | "neighborhood" | "dietary", Set<string>> = {
  cuisine: new Set(cuisineOptions.map((option) => option.value)),
  neighborhood: new Set(neighborhoodOptions.map((option) => option.value)),
  dietary: new Set(dietaryOptions.map((option) => option.value)),
};

const allowed = (key: keyof typeof knownValues, value: string) =>
  knownValues[key].has(value) ? value : "";

export function readFiltersFromUrl(): DiscoverFilters {
  const params = new URLSearchParams(window.location.search);

  return {
    q: params.get("q") ?? "",
    cuisine: allowed("cuisine", params.get("cuisine") ?? ""),
    neighborhood: allowed("neighborhood", params.get("neighborhood") ?? ""),
    dietary: allowed("dietary", params.get("dietary") ?? ""),
  };
}

export function writeFiltersToUrl(
  filters: DiscoverFilters,
  mode: "push" | "replace",
) {
  const url = new URL(window.location.href);

  for (const key of ["q", "cuisine", "neighborhood", "dietary"] as const) {
    const value = filters[key].trim();
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }

  if (url.href !== window.location.href) {
    window.history[mode === "push" ? "pushState" : "replaceState"](null, "", url);
  }
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .trim();

export function filterRestaurants(
  restaurants: Restaurant[],
  filters: DiscoverFilters,
): Restaurant[] {
  const search = normalize(filters.q);

  return restaurants.filter((restaurant) => {
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine) return false;
    if (filters.neighborhood && restaurant.neighborhood !== filters.neighborhood)
      return false;
    if (
      filters.dietary &&
      !restaurant.dietaryOptions.some((option) => option === filters.dietary)
    )
      return false;

    if (!search) return true;

    const text = normalize(
      [
        restaurant.name,
        cuisineLabel(restaurant.cuisine),
        restaurant.neighborhood,
        restaurant.area,
        "Paris " + restaurant.neighborhood,
        restaurant.description,
      ].join(" "),
    );

    return text.includes(search);
  });
}
