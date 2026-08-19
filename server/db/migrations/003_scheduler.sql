CREATE TABLE IF NOT EXISTS bookings (
  booking_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  idempotency_key_hash BINARY(32) NOT NULL,
  request_hash BINARY(32) NOT NULL,
  starts_at DATETIME(3) NOT NULL,
  ends_at DATETIME(3) NOT NULL,
  pending_starts_at DATETIME(3) NULL,
  pending_ends_at DATETIME(3) NULL,
  booking_status VARCHAR(24) NOT NULL DEFAULT 'pending_calendar',
  visitor_timezone VARCHAR(64) NOT NULL,
  contact_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  email_normalized VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NULL,
  company VARCHAR(120) NULL,
  meeting_mode VARCHAR(16) NOT NULL,
  source VARCHAR(64) NOT NULL,
  client_ip_hash BINARY(32) NOT NULL,
  management_token_hash BINARY(32) NOT NULL,
  google_event_id VARCHAR(255) NULL,
  meeting_url VARCHAR(500) NULL,
  confirmation_delivery_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  confirmation_provider_message_id VARCHAR(255) NULL,
  confirmation_error_message VARCHAR(1000) NULL,
  confirmation_sent_at DATETIME(3) NULL,
  cancelled_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  UNIQUE KEY bookings_idempotency_unique (idempotency_key_hash),
  UNIQUE KEY bookings_management_token_unique (management_token_hash),
  UNIQUE KEY bookings_google_event_unique (google_event_id),
  INDEX bookings_start_idx (starts_at),
  INDEX bookings_email_created_idx (email_normalized, created_at),
  INDEX bookings_status_start_idx (booking_status, starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS booking_slot_locks (
  starts_at DATETIME(3) NOT NULL PRIMARY KEY,
  ends_at DATETIME(3) NOT NULL,
  booking_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  lock_kind VARCHAR(16) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  INDEX booking_slot_locks_booking_idx (booking_id, lock_kind),
  CONSTRAINT booking_slot_locks_booking_fk
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
