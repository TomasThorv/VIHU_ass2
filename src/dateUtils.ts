import { add as addDate, isAfter, isBefore, isSameDay as isSameDate, getYear } from "date-fns";
import { DATE_UNIT_TYPES } from "./constants";
import { Year, Holiday, Holidays, Unit } from "./types";

export function getCurrentYear(): Year {
  return getYear(new Date());
}

export function add(date: Holiday, amount: number, type: Unit = DATE_UNIT_TYPES.DAYS): Holiday {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }

  const duration: Record<string, number> = {};
  switch (type) {
    case DATE_UNIT_TYPES.SECONDS:
      duration.seconds = amount;
      break;
    case DATE_UNIT_TYPES.MINUTES:
      duration.minutes = amount;
      break;
    case DATE_UNIT_TYPES.DAYS:
      duration.days = amount;
      break;
    case DATE_UNIT_TYPES.WEEKS:
      duration.weeks = amount;
      break;
    case DATE_UNIT_TYPES.MONTHS:
      duration.months = amount;
      break;
    case DATE_UNIT_TYPES.YEARS:
      duration.years = amount;
      break;
    default:
      duration.days = amount;
  }

  return addDate(date, duration as any);
}

export function isWithinRange(date: Holiday, from: Holiday, to: Holiday): boolean {
  if (isAfter(from, to)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  return isAfter(date, from) && isBefore(date, to);
}

export function isDateBefore(date: Holiday, compareDate: Holiday): boolean {
  return isBefore(date, compareDate);
}

export function isSameDay(date: Holiday, compareDate: Holiday): boolean {
  return isSameDate(date, compareDate);
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
