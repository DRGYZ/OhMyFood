export function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function bookingWindow(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const end = new Date(start);
  end.setDate(end.getDate() + 30);
  return { min: localDateString(start), max: localDateString(end) };
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
}

export function isBookingDate(value: string, now = new Date()): boolean {
  if (!isCalendarDate(value)) return false;
  const { min, max } = bookingWindow(now);
  return value >= min && value <= max;
}

export function weekdayForDate(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12).getDay();
}
