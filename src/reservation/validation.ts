import { isBookingDate } from "./dates";

export interface ReservationFields {
  partySize: number;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type ReservationField = keyof ReservationFields;
export type ReservationErrors = Partial<Record<ReservationField, string>>;

export function validateReservation(
  fields: ReservationFields,
  availableTimes: string[],
  hasSelection: boolean,
  now = new Date(),
): ReservationErrors {
  const errors: ReservationErrors = {};
  if (!Number.isInteger(fields.partySize) || fields.partySize < 1 || fields.partySize > 8) {
    errors.partySize = "Choisissez entre 1 et 8 convives.";
  }
  if (!isBookingDate(fields.date, now)) {
    errors.date = "Choisissez une date valide dans les 30 prochains jours.";
  }
  if (!fields.time || !availableTimes.includes(fields.time)) {
    errors.time = "Choisissez un créneau disponible.";
  }
  if (!fields.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!fields.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Indiquez une adresse e-mail valide.";
  }
  if (fields.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Indiquez un numéro de téléphone valide.";
  }
  if (!hasSelection) errors.time = "Votre menu doit contenir au moins un plat.";
  return errors;
}
