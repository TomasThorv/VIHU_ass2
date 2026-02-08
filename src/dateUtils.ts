import moment from "moment";
import { DATE_UNIT_TYPES } from "./constants";
import { Year, Holiday, Holidays, Unit } from "./types";

export function getCurrentYear(): Year {
  return moment().year();
}

export function add(date: Holiday, amount: number, type: Unit = DATE_UNIT_TYPES.DAYS): Holiday {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }
  return moment(date).add(amount, type).toDate();
}

export function isWithinRange(date: Holiday, from: Holiday, to: Holiday): boolean {
  if (moment(from).isAfter(to)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  return moment(date).isBetween(from, to);
}

export function isDateBefore(date: Holiday, compareDate: Holiday): boolean {
  return moment(date).isBefore(compareDate);
}

export function isSameDay(date: Holiday, compareDate: Holiday): boolean {
  return moment(date).isSame(compareDate, 'day');
}

// Simulates fetching holidays from an API
export async function getHolidays(year: Year): Promise<Holidays> {
  return new Promise<Holidays>((resolve) => {
    setTimeout(() => {
      resolve([
        new Date(year, 0, 1),   // New Year's Day
        new Date(year, 11, 25), // Christmas
        new Date(year, 11, 31), // New Year's Eve
      ]);
    }, 100);
  });
}

export async function isHoliday(date: Holiday): Promise<boolean> {
  const holidays = await getHolidays(date.getFullYear());
  return holidays.some(holiday => isSameDay(date, holiday));
}
