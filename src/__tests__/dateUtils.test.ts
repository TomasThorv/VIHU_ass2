import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentYear, add, isWithinRange, isDateBefore, isSameDay, getHolidays, isHoliday } from '../dateUtils';

afterEach(() => {
  vi.useRealTimers();
});

describe("getCurrentYear", () => {
  it("returns the year based on the current system time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-05-15T12:00:00Z'));

    const result = getCurrentYear();

    expect(result).toBe(2025);
  });
});

describe("add", () => {
  it("adds the specified days by default", () => {
    const base = new Date('2025-01-10T00:00:00Z');

    const result = add(base, 5);

    expect(result.toISOString()).toBe('2025-01-15T00:00:00.000Z');
  });

  it("adds the specified unit type", () => {
    const base = new Date('2025-01-10T00:00:00Z');

    const result = add(base, 2, 'months');

    expect(result.toISOString()).toBe('2025-03-10T00:00:00.000Z');
  });

  it("throws for invalid date input", () => {
    expect(() => add('not-a-date' as unknown as Date, 1)).toThrow('Invalid date provided');
  });

  it("throws for invalid amount input", () => {
    const base = new Date('2025-01-10T00:00:00Z');

    expect(() => add(base, Number.NaN)).toThrow('Invalid amount provided');
    expect(() => add(base, 'abc' as unknown as number)).toThrow('Invalid amount provided');
  });
});

describe("isWithinRange", () => {
  it("returns true when date is strictly between the range", () => {
    const from = new Date('2025-01-01T00:00:00Z');
    const to = new Date('2025-01-10T00:00:00Z');
    const date = new Date('2025-01-05T00:00:00Z');

    expect(isWithinRange(date, from, to)).toBe(true);
  });

  it("returns false when date is on the boundary (exclusive check)", () => {
    const from = new Date('2025-01-01T00:00:00Z');
    const to = new Date('2025-01-10T00:00:00Z');

    expect(isWithinRange(from, from, to)).toBe(false);
    expect(isWithinRange(to, from, to)).toBe(false);
  });

  it("throws when from date is after to date", () => {
    const from = new Date('2025-02-01T00:00:00Z');
    const to = new Date('2025-01-10T00:00:00Z');
    const date = new Date('2025-01-15T00:00:00Z');

    expect(() => isWithinRange(date, from, to)).toThrow('Invalid range: from date must be before to date');
  });
});

describe("isDateBefore", () => {
  it("returns true when date is before compareDate", () => {
    const date = new Date('2025-01-01T00:00:00Z');
    const compare = new Date('2025-02-01T00:00:00Z');

    expect(isDateBefore(date, compare)).toBe(true);
  });

  it("returns false when date is equal or after compareDate", () => {
    const date = new Date('2025-02-01T00:00:00Z');
    const compare = new Date('2025-02-01T00:00:00Z');

    expect(isDateBefore(date, compare)).toBe(false);
    expect(isDateBefore(new Date('2025-03-01T00:00:00Z'), compare)).toBe(false);
  });
});

describe("isSameDay", () => {
  it("returns true when dates share the same calendar day", () => {
    const a = new Date('2025-01-01T05:00:00Z');
    const b = new Date('2025-01-01T23:59:59Z');

    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false when dates fall on different days", () => {
    const a = new Date('2025-01-01T23:59:59Z');
    const b = new Date('2025-01-02T00:00:00Z');

    expect(isSameDay(a, b)).toBe(false);
  });
});

describe("getHolidays", () => {
  it("returns expected holidays for the year", async () => {
    const year = 2025;

    const holidays = await getHolidays(year);

    expect(holidays).toHaveLength(3);
    expect(holidays[0].toISOString()).toBe('2025-01-01T00:00:00.000Z');
    expect(holidays[1].toISOString()).toBe('2025-12-25T00:00:00.000Z');
    expect(holidays[2].toISOString()).toBe('2025-12-31T00:00:00.000Z');
  });
});

describe("isHoliday", () => {
  it("returns true for a known holiday", async () => {
    const date = new Date('2025-01-01T10:00:00Z');

    await expect(isHoliday(date)).resolves.toBe(true);
  });

  it("returns false for a non-holiday date", async () => {
    const date = new Date('2025-01-02T00:00:00Z');

    await expect(isHoliday(date)).resolves.toBe(false);
  });
});
