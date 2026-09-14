import { describe, expect, it } from "vitest";
import { bookingWindow, isBookingDate } from "./dates";
import { validateReservation, type ReservationFields } from "./validation";

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
