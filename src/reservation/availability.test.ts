import { describe, expect, it } from "vitest";
import { getAvailability } from "./availability";
import { bookingWindow, isBookingDate, weekdayForDate } from "./dates";

function nextWeekday(day: number): string {
  const start = new Date();
  for (let offset = 0; offset <= 7; offset++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + offset, 12);
    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    if (weekdayForDate(value) === day) return value;
  }
  throw new Error("A weekday should exist in a seven-day window");
}

describe("mock availability", () => {
  it("returns the same slots for the same restaurant, date and party size", async () => {
    const request = { restaurantId: "palette", date: nextWeekday(3), partySize: 2 };
    const first = await getAvailability(request);
    expect(first.length).toBeGreaterThan(0);
    expect(await getAvailability(request)).toEqual(first);
  });

  it("returns no slots for large Monday tables", async () => {
    expect(await getAvailability({
      restaurantId: "palette", date: nextWeekday(1), partySize: 7,
    })).toEqual([]);
  });

  it("reports an offline failure and succeeds on retry when online", async () => {
    const request = { restaurantId: "palette", date: nextWeekday(6), partySize: 8 };
    await expect(getAvailability(request, undefined, false)).rejects.toThrow("temporairement");
    await expect(getAvailability(request, undefined, true)).resolves.not.toEqual([]);
  });

  it("rejects invalid inputs and cancelled requests", async () => {
    const { min, max } = bookingWindow();
    expect(isBookingDate(min)).toBe(true);
    expect(isBookingDate(max)).toBe(true);
    await expect(getAvailability({
      restaurantId: "missing", date: min, partySize: 2,
    })).rejects.toThrow("invalides");
    await expect(getAvailability({
      restaurantId: "palette", date: "2026-02-31", partySize: 2,
    })).rejects.toThrow("invalides");
    await expect(getAvailability({
      restaurantId: "palette", date: min, partySize: 9,
    })).rejects.toThrow("invalides");
    const controller = new AbortController();
    const pending = getAvailability({
      restaurantId: "palette", date: min, partySize: 2,
    }, controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});
