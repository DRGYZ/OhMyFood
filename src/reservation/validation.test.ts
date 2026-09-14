import { describe, expect, it } from "vitest";
import { bookingWindow, formatFrenchDate, isBookingDate, localDateString } from "./dates";
import { firstInvalidField, validateReservation, type ReservationFields } from "./validation";

const now = new Date(2026, 8, 14, 12);
const valid: ReservationFields = {
  partySize: 2,
  date: "2026-09-14",
  time: "19:30",
  firstName: "Yazan",
  lastName: "Test",
  email: "yazan@example.com",
  phone: "+33 6 12 34 56 78",
};

describe("reservation validation", () => {
  it("accepts a complete form and the booking-window boundaries", () => {
    expect(validateReservation(valid, ["19:00", "19:30"], true, now)).toEqual({});
    expect(bookingWindow(now)).toEqual({ min: "2026-09-14", max: "2026-10-14" });
    expect(isBookingDate("2026-10-14", now)).toBe(true);
  });

  it("keeps local day boundaries across daylight-saving changes", () => {
    const spring = new Date(2026, 2, 29, 23, 59);
    const autumn = new Date(2026, 9, 25, 0, 1);
    expect(localDateString(spring)).toBe("2026-03-29");
    expect(bookingWindow(spring)).toEqual({ min: "2026-03-29", max: "2026-04-28" });
    expect(bookingWindow(autumn)).toEqual({ min: "2026-10-25", max: "2026-11-24" });
    expect(formatFrenchDate("2026-09-14")).toBe("lundi 14 septembre 2026");
  });

  it("prioritizes date and time before contact errors", () => {
    expect(firstInvalidField({ email: "invalid", time: "missing", date: "missing" })).toBe("date");
    expect(firstInvalidField({ email: "invalid", time: "missing" })).toBe("time");
    expect(firstInvalidField({ phone: "invalid", firstName: "missing" })).toBe("firstName");
    expect(firstInvalidField({})).toBeUndefined();
  });

  it("requires a menu, time and contact fields", () => {
    const errors = validateReservation({
      ...valid, time: "", firstName: " ", lastName: "", email: "", phone: "",
    }, ["19:30"], false, now);
    expect(errors).toMatchObject({
      time: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
    });
  });

  it("rejects invalid party, dates, email and unlisted time", () => {
    for (const date of ["2026-09-13", "2026-10-15", "2026-02-31", "bad"]) {
      expect(validateReservation({
        ...valid, partySize: 9, date, time: "20:00", email: "bad@",
      }, ["19:30"], true, now)).toMatchObject({
        partySize: expect.any(String),
        date: expect.any(String),
        time: expect.any(String),
        email: expect.any(String),
      });
    }
  });
});
