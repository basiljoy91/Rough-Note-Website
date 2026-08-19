CREATE TABLE IF NOT EXISTS email_outbox (
  outbox_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dedupe_key VARCHAR(190) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  message_kind VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  aggregate_id VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  payload_iv BINARY(12) NOT NULL,
  payload_auth_tag BINARY(16) NOT NULL,
  payload_ciphertext LONGBLOB NOT NULL,
  payload_key_version SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  delivery_status VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT 'pending',
  attempt_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts SMALLINT UNSIGNED NOT NULL,
  next_attempt_at DATETIME(3) NOT NULL,
  locked_at DATETIME(3) NULL,
  provider_message_id VARCHAR(255) NULL,
  error_code VARCHAR(80) NULL,
  error_summary VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  sent_at DATETIME(3) NULL,
  UNIQUE KEY email_outbox_dedupe_unique (dedupe_key),
  INDEX email_outbox_due_idx (delivery_status, next_attempt_at),
  INDEX email_outbox_aggregate_idx (message_kind, aggregate_id),
  INDEX email_outbox_retention_idx (delivery_status, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS maintenance_runs (
  maintenance_run_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  run_status VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  rate_limits_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  attachments_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  contacts_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  bookings_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  subscribers_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  outbox_deleted INT UNSIGNED NOT NULL DEFAULT 0,
  outbox_sent INT UNSIGNED NOT NULL DEFAULT 0,
  outbox_failed INT UNSIGNED NOT NULL DEFAULT 0,
  error_code VARCHAR(80) NULL,
  started_at DATETIME(3) NOT NULL,
  finished_at DATETIME(3) NULL,
  INDEX maintenance_runs_started_idx (started_at),
  INDEX maintenance_runs_status_idx (run_status, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
