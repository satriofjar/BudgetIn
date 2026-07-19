import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
} from "date-fns";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthRange(year: number, month: number) {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  return { start, end };
}

export function yearRange(year: number) {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(start);
  return { start, end };
}

export function previousMonth(year: number, month: number) {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}
