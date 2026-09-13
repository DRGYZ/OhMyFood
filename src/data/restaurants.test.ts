import { describe, expect, it } from "vitest";
import { restaurantById, restaurantBySlug, restaurants } from "./restaurants";

describe("restaurant lookups", () => {
  it("resolves all catalog entries by id and slug", () => {
    for (const restaurant of restaurants) {
      expect(restaurantById(restaurant.id)).toBe(restaurant);
      expect(restaurantBySlug(restaurant.slug)).toBe(restaurant);
    }
  });

  it("returns undefined for unknown ids and slugs", () => {
    expect(restaurantById("unknown")).toBeUndefined();
    expect(restaurantBySlug("unknown")).toBeUndefined();
  });
});
