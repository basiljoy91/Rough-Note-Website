import { describe, expect, it } from 'vitest';
import {
  availableSlotsForDate,
  findConfiguredSlot,
  parseBusinessDate
} from '../../server/services/availability';

const config = {
  timezone: 'Asia/Kolkata',
  utcOffsetMinutes: 330,
  weekdays: new Set([1, 2, 3, 4, 5]),
  startHour: 10,
  endHour: 17,
  slotMinutes: 30,
  leadMinutes: 60,
  horizonDays: 60
};

const now = new Date('2026-08-19T00:00:00.000Z');

describe('scheduler availability rules', () => {
  it('generates aligned IST weekday slots in UTC', () => {
    const slots = availableSlotsForDate('2026-08-20', config, now, []);
    expect(slots[0]?.startAt.toISOString()).toBe('2026-08-20T04:30:00.000Z');
    expect(slots.at(-1)?.startAt.toISOString()).toBe('2026-08-20T11:00:00.000Z');
    expect(slots).toHaveLength(14);
  });

  it('removes every slot that overlaps a calendar busy period', () => {
    const slots = availableSlotsForDate('2026-08-20', config, now, [
      {
        startAt: new Date('2026-08-20T04:45:00.000Z'),
        endAt: new Date('2026-08-20T05:15:00.000Z')
      }
    ]);
    expect(slots.map((slot) => slot.startAt.toISOString())).not.toContain(
      '2026-08-20T04:30:00.000Z'
    );
    expect(slots.map((slot) => slot.startAt.toISOString())).not.toContain(
      '2026-08-20T05:00:00.000Z'
    );
  });

  it('rejects weekends, past times and off-grid booking requests', () => {
    expect(availableSlotsForDate('2026-08-22', config, now, [])).toEqual([]);
    expect(
      findConfiguredSlot(new Date('2026-08-18T04:30:00.000Z'), config, now)
    ).toBeNull();
    expect(
      findConfiguredSlot(new Date('2026-08-20T04:45:00.000Z'), config, now)
    ).toBeNull();
  });

  it('strictly validates calendar dates', () => {
    expect(parseBusinessDate('2026-02-29')).toBeNull();
    expect(parseBusinessDate('2026-08-20')).toEqual({
      year: 2026,
      month: 8,
      day: 20
    });
  });
});
