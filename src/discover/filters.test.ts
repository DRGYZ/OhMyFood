import { describe, expect, it } from "vitest";
import { filterRestaurants, parseFilters, filtersToSearchParams } from "./filters";
import { restaurants } from "./restaurants";

const empty = { q: "", cuisine: "", neighborhood: "", dietary: "" };

describe("Discover filters", () => {
  it("returns every restaurant when filters are empty", () => {
    expect(filterRestaurants(restaurants, empty)).toHaveLength(4);
    expect(filtersToSearchParams(empty).toString()).toBe("");
  });

  it("matches names without accents or case sensitivity", () => {
    expect(filterRestaurants(restaurants, { ...empty, q: "delice" }).map((r) => r.id))
      .toEqual(["delice"]);
    expect(filterRestaurants(restaurants, { ...empty, q: "FRANÇAISE" }).map((r) => r.id))
      .toEqual(["francaise"]);
  });

  it("combines search, cuisine, and neighborhood", () => {
    const filters = { q: "bastille", cuisine: "bistronomie", neighborhood: "11e", dietary: "" };
    expect(filterRestaurants(restaurants, filters).map((r) => r.id)).toEqual(["palette"]);
    expect(filterRestaurants(restaurants, { ...filters, neighborhood: "20e" })).toEqual([]);
  });

  it("filters dietary options alongside other filters", () => {
    expect(filterRestaurants(restaurants, { ...empty, dietary: "sans-gluten" }).map((r) => r.id))
      .toEqual(["delice"]);
    expect(filterRestaurants(restaurants, { ...empty, dietary: "vegetarien", cuisine: "creative" }).map((r) => r.id))
      .toEqual(["note"]);
  });

  it("ignores unknown URL filter values and serializes only active values", () => {
    const filters = parseFilters(new URLSearchParams("q=note&cuisine=unknown&neighborhood=99e&dietary=vegan"));
    expect(filters).toEqual({ ...empty, q: "note" });
    expect(filterRestaurants(restaurants, filters).map((r) => r.id)).toEqual(["note"]);
    expect(filtersToSearchParams(filters).toString()).toBe("q=note");
  });
});
