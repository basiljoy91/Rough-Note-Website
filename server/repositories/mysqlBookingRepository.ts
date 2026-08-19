import type { Pool, RowDataPacket } from 'mysql2/promise';
import type {
  BookingCreationResult,
  BookingRecord,
  BookingRepository
} from '../types.js';

interface BookingRow extends RowDataPacket {
  booking_id: string;
  idempotency_key_hash: Buffer;
  request_hash: Buffer;
  starts_at: Date;
  ends_at: Date;
  pending_starts_at: Date | null;
  pending_ends_at: Date | null;
  booking_status: BookingRecord['status'];
  visitor_timezone: string;
  contact_name: string;
  email: string;
  email_normalized: string;
  phone: string | null;
  company: string | null;
  meeting_mode: BookingRecord['mode'];
  source: string;
  client_ip_hash: Buffer;
  management_token_hash: Buffer;
  google_event_id: string | null;
  meeting_url: string | null;
  confirmation_delivery_status: BookingRecord['confirmationDeliveryStatus'];
  created_at: Date;
}

const bookingColumns = `booking_id, idempotency_key_hash, request_hash,
  starts_at, ends_at, pending_starts_at, pending_ends_at, booking_status,
  visitor_timezone, contact_name, email, email_normalized, phone, company,
  meeting_mode, source, client_ip_hash, management_token_hash,
  google_event_id, meeting_url, confirmation_delivery_status, created_at`;

function asDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(`${value}Z`);
}

function asRecord(row: BookingRow): BookingRecord {
  return {
    bookingId: row.booking_id,
    idempotencyKeyHash: row.idempotency_key_hash,
    requestHash: row.request_hash,
    startAt: asDate(row.starts_at),
    endAt: asDate(row.ends_at),
    pendingStartAt: row.pending_starts_at
      ? asDate(row.pending_starts_at)
      : null,
    pendingEndAt: row.pending_ends_at ? asDate(row.pending_ends_at) : null,
    status: row.booking_status,
    timezone: row.visitor_timezone,
    name: row.contact_name,
    email: row.email,
    emailNormalized: row.email_normalized,
    phone: row.phone,
    company: row.company,
    mode: row.meeting_mode,
    source: row.source,
    clientIpHash: row.client_ip_hash,
    managementTokenHash: row.management_token_hash,
    googleEventId: row.google_event_id,
    meetingUrl: row.meeting_url,
    confirmationDeliveryStatus: row.confirmation_delivery_status,
    createdAt: asDate(row.created_at)
  };
}

function isDuplicate(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  );
}

export class MySqlBookingRepository implements BookingRepository {
  constructor(private readonly pool: Pool) {}

  async listBookedStartTimes(rangeStart: Date, rangeEnd: Date): Promise<Date[]> {
    const [rows] = await this.pool.execute<
      Array<RowDataPacket & { starts_at: Date }>
    >(
      `SELECT starts_at FROM booking_slot_locks
       WHERE starts_at >= ? AND starts_at < ?`,
      [rangeStart, rangeEnd]
    );
    return rows.map((row) => asDate(row.starts_at));
  }

  async createBooking(record: BookingRecord): Promise<BookingCreationResult> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [existingRows] = await connection.execute<BookingRow[]>(
        `SELECT ${bookingColumns} FROM bookings
         WHERE idempotency_key_hash = ? FOR UPDATE`,
        [record.idempotencyKeyHash]
      );
      const existing = existingRows[0];
      if (existing) {
        await connection.commit();
        return existing.request_hash.equals(record.requestHash)
          ? { outcome: 'idempotent', booking: asRecord(existing) }
          : { outcome: 'key-mismatch' };
      }

      await connection.execute(
        `INSERT INTO bookings (
          booking_id, idempotency_key_hash, request_hash, starts_at, ends_at,
          booking_status, visitor_timezone, contact_name, email,
          email_normalized, phone, company, meeting_mode, source,
          client_ip_hash, management_token_hash,
          confirmation_delivery_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'pending_calendar', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          'pending', ?, ?)`,
        [
          record.bookingId,
          record.idempotencyKeyHash,
          record.requestHash,
          record.startAt,
          record.endAt,
          record.timezone,
          record.name,
          record.email,
          record.emailNormalized,
          record.phone,
          record.company,
          record.mode,
          record.source,
          record.clientIpHash,
          record.managementTokenHash,
          record.createdAt,
          record.createdAt
        ]
      );
      await connection.execute(
        `INSERT INTO booking_slot_locks
          (starts_at, ends_at, booking_id, lock_kind, created_at)
         VALUES (?, ?, ?, 'current', ?)`,
        [record.startAt, record.endAt, record.bookingId, record.createdAt]
      );
      await connection.commit();
      return { outcome: 'created', booking: record };
    } catch (error) {
      await connection.rollback();
      if (isDuplicate(error)) {
        const existing = await this.findByIdempotencyKeyHash(
          record.idempotencyKeyHash
        );
        if (existing) {
          return existing.requestHash.equals(record.requestHash)
            ? { outcome: 'idempotent', booking: existing }
            : { outcome: 'key-mismatch' };
        }
        return { outcome: 'slot-conflict' };
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  async findByIdempotencyKeyHash(hash: Buffer): Promise<BookingRecord | null> {
    const [rows] = await this.pool.execute<BookingRow[]>(
      `SELECT ${bookingColumns} FROM bookings WHERE idempotency_key_hash = ?`,
      [hash]
    );
    return rows[0] ? asRecord(rows[0]) : null;
  }

  async saveCalendarDetails(
    bookingId: string,
    googleEventId: string,
    meetingUrl: string | null,
    updatedAt: Date
  ): Promise<BookingRecord> {
    await this.pool.execute(
      `UPDATE bookings SET booking_status = 'confirmed', google_event_id = ?,
       meeting_url = ?, updated_at = ? WHERE booking_id = ?
       AND booking_status IN ('pending_calendar', 'confirmed')`,
      [googleEventId, meetingUrl, updatedAt, bookingId]
    );
    return this.requireById(bookingId);
  }

  async markConfirmationSent(
    bookingId: string,
    providerMessageId: string | null,
    sentAt: Date
  ): Promise<void> {
    await this.pool.execute(
      `UPDATE bookings SET confirmation_delivery_status = 'sent',
       confirmation_provider_message_id = ?, confirmation_error_message = NULL,
       confirmation_sent_at = ?, updated_at = ? WHERE booking_id = ?`,
      [providerMessageId, sentAt, sentAt, bookingId]
    );
  }

  async markConfirmationFailed(
    bookingId: string,
    errorMessage: string,
    attemptedAt: Date
  ): Promise<void> {
    await this.pool.execute(
      `UPDATE bookings SET confirmation_delivery_status = 'failed',
       confirmation_error_message = ?, updated_at = ? WHERE booking_id = ?`,
      [errorMessage.slice(0, 1000), attemptedAt, bookingId]
    );
  }

  async findByManagementTokenHash(tokenHash: Buffer): Promise<BookingRecord | null> {
    const [rows] = await this.pool.execute<BookingRow[]>(
      `SELECT ${bookingColumns} FROM bookings WHERE management_token_hash = ?`,
      [tokenHash]
    );
    return rows[0] ? asRecord(rows[0]) : null;
  }

  async markCancelled(bookingId: string, cancelledAt: Date): Promise<BookingRecord> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        'DELETE FROM booking_slot_locks WHERE booking_id = ?',
        [bookingId]
      );
      await connection.execute(
        `UPDATE bookings SET booking_status = 'cancelled', cancelled_at = ?,
         pending_starts_at = NULL, pending_ends_at = NULL, updated_at = ?
         WHERE booking_id = ?`,
        [cancelledAt, cancelledAt, bookingId]
      );
      await connection.commit();
      return this.requireById(bookingId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async reserveReschedule(
    bookingId: string,
    newStartAt: Date,
    newEndAt: Date,
    requestedAt: Date
  ): Promise<'reserved' | 'slot-conflict' | 'invalid-state'> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<BookingRow[]>(
        `SELECT ${bookingColumns} FROM bookings WHERE booking_id = ? FOR UPDATE`,
        [bookingId]
      );
      const booking = rows[0];
      if (!booking || booking.booking_status !== 'confirmed') {
        await connection.rollback();
        return 'invalid-state';
      }
      await connection.execute(
        `INSERT INTO booking_slot_locks
          (starts_at, ends_at, booking_id, lock_kind, created_at)
         VALUES (?, ?, ?, 'pending', ?)`,
        [newStartAt, newEndAt, bookingId, requestedAt]
      );
      await connection.execute(
        `UPDATE bookings SET booking_status = 'reschedule_pending',
         pending_starts_at = ?, pending_ends_at = ?, updated_at = ?
         WHERE booking_id = ?`,
        [newStartAt, newEndAt, requestedAt, bookingId]
      );
      await connection.commit();
      return 'reserved';
    } catch (error) {
      await connection.rollback();
      if (isDuplicate(error)) return 'slot-conflict';
      throw error;
    } finally {
      connection.release();
    }
  }

  async finalizeReschedule(
    bookingId: string,
    completedAt: Date
  ): Promise<BookingRecord> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<BookingRow[]>(
        `SELECT ${bookingColumns} FROM bookings WHERE booking_id = ? FOR UPDATE`,
        [bookingId]
      );
      const row = rows[0];
      if (!row?.pending_starts_at || !row.pending_ends_at) {
        throw new Error('The booking does not have a pending reschedule.');
      }
      await connection.execute(
        `DELETE FROM booking_slot_locks
         WHERE booking_id = ? AND starts_at <> ?`,
        [bookingId, row.pending_starts_at]
      );
      await connection.execute(
        `UPDATE booking_slot_locks SET lock_kind = 'current'
         WHERE booking_id = ? AND starts_at = ?`,
        [bookingId, row.pending_starts_at]
      );
      await connection.execute(
        `UPDATE bookings SET starts_at = pending_starts_at,
         ends_at = pending_ends_at, pending_starts_at = NULL,
         pending_ends_at = NULL, booking_status = 'confirmed', updated_at = ?
         WHERE booking_id = ?`,
        [completedAt, bookingId]
      );
      await connection.commit();
      return this.requireById(bookingId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async abortReschedule(bookingId: string, abortedAt: Date): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        `DELETE FROM booking_slot_locks
         WHERE booking_id = ? AND lock_kind = 'pending'`,
        [bookingId]
      );
      await connection.execute(
        `UPDATE bookings SET pending_starts_at = NULL, pending_ends_at = NULL,
         booking_status = 'confirmed', updated_at = ? WHERE booking_id = ?
         AND booking_status = 'reschedule_pending'`,
        [abortedAt, bookingId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async requireById(bookingId: string): Promise<BookingRecord> {
    const [rows] = await this.pool.execute<BookingRow[]>(
      `SELECT ${bookingColumns} FROM bookings WHERE booking_id = ?`,
      [bookingId]
    );
    if (!rows[0]) throw new Error('The booking could not be found.');
    return asRecord(rows[0]);
  }
}
