import type { RuntimeConfig } from '../config.js';
import type { BusyPeriod } from '../types.js';

export interface AvailabilitySlot {
  startAt: Date;
  endAt: Date;
}

type SchedulerConfig = RuntimeConfig['scheduler'];

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseBusinessDate(value: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function businessDateForInstant(
  instant: Date,
  utcOffsetMinutes: number
): string {
  return new Date(instant.getTime() + utcOffsetMinutes * 60_000)
    .toISOString()
    .slice(0, 10);
}

function localTimeToUtc(
  date: { year: number; month: number; day: number },
  hour: number,
  minute: number,
  utcOffsetMinutes: number
): Date {
  return new Date(
    Date.UTC(date.year, date.month - 1, date.day, hour, minute) -
      utcOffsetMinutes * 60_000
  );
}

export function businessDayRange(
  dateValue: string,
  config: SchedulerConfig
): { startAt: Date; endAt: Date } | null {
  const date = parseBusinessDate(dateValue);
  if (!date) return null;
  return {
    startAt: localTimeToUtc(
      date,
      config.startHour,
      0,
      config.utcOffsetMinutes
    ),
    endAt: localTimeToUtc(
      date,
      config.endHour,
      0,
      config.utcOffsetMinutes
    )
  };
}

function overlaps(slot: AvailabilitySlot, busy: BusyPeriod): boolean {
  return slot.startAt < busy.endAt && slot.endAt > busy.startAt;
}

export function configuredSlotsForDate(
  dateValue: string,
  config: SchedulerConfig,
  now: Date
): AvailabilitySlot[] {
  const date = parseBusinessDate(dateValue);
  if (!date) return [];
  const weekday = new Date(
    Date.UTC(date.year, date.month - 1, date.day)
  ).getUTCDay();
  if (!config.weekdays.has(weekday)) return [];

  const range = businessDayRange(dateValue, config);
  if (!range) return [];
  const earliest = now.getTime() + config.leadMinutes * 60_000;
  const latest = now.getTime() + config.horizonDays * 86_400_000;
  const duration = config.slotMinutes * 60_000;
  const slots: AvailabilitySlot[] = [];

  for (
    let cursor = range.startAt.getTime();
    cursor + duration <= range.endAt.getTime();
    cursor += duration
  ) {
    if (cursor < earliest || cursor > latest) continue;
    slots.push({
      startAt: new Date(cursor),
      endAt: new Date(cursor + duration)
    });
  }
  return slots;
}

export function availableSlotsForDate(
  dateValue: string,
  config: SchedulerConfig,
  now: Date,
  busyPeriods: BusyPeriod[]
): AvailabilitySlot[] {
  return configuredSlotsForDate(dateValue, config, now).filter(
    (slot) => !busyPeriods.some((busy) => overlaps(slot, busy))
  );
}

export function findConfiguredSlot(
  requestedStartAt: Date,
  config: SchedulerConfig,
  now: Date
): AvailabilitySlot | null {
  if (Number.isNaN(requestedStartAt.getTime())) return null;
  const dateValue = businessDateForInstant(
    requestedStartAt,
    config.utcOffsetMinutes
  );
  return (
    configuredSlotsForDate(dateValue, config, now).find(
      (slot) => slot.startAt.getTime() === requestedStartAt.getTime()
    ) ?? null
  );
}

export function hasBusyOverlap(
  slot: AvailabilitySlot,
  busyPeriods: BusyPeriod[]
): boolean {
  return busyPeriods.some((busy) => overlaps(slot, busy));
}
