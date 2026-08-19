CREATE TABLE IF NOT EXISTS schema_migrations (
  migration_name VARCHAR(190) NOT NULL PRIMARY KEY,
  applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS contact_submissions (
  submission_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  solution_type VARCHAR(64) NOT NULL,
  department VARCHAR(64) NOT NULL,
  challenge_text TEXT NOT NULL,
  contact_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  email_normalized VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NULL,
  website VARCHAR(500) NULL,
  contact_role VARCHAR(64) NOT NULL,
  source VARCHAR(64) NOT NULL,
  client_ip_hash BINARY(32) NOT NULL,
  user_agent VARCHAR(500) NULL,
  received_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX contact_submissions_received_at_idx (received_at),
  INDEX contact_submissions_email_received_idx (email_normalized, received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS contact_attachments (
  submission_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  original_file_name VARCHAR(255) NOT NULL,
  file_extension VARCHAR(8) NOT NULL,
  detected_mime VARCHAR(127) NOT NULL,
  byte_size INT UNSIGNED NOT NULL,
  sha256 BINARY(32) NOT NULL,
  file_content LONGBLOB NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT contact_attachments_submission_fk
    FOREIGN KEY (submission_id) REFERENCES contact_submissions (submission_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS contact_notifications (
  notification_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  submission_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  delivery_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  attempt_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  provider_message_id VARCHAR(255) NULL,
  error_message VARCHAR(1000) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  last_attempt_at DATETIME(3) NULL,
  sent_at DATETIME(3) NULL,
  UNIQUE KEY contact_notifications_submission_unique (submission_id),
  INDEX contact_notifications_status_idx (delivery_status, created_at),
  CONSTRAINT contact_notifications_submission_fk
    FOREIGN KEY (submission_id) REFERENCES contact_submissions (submission_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS contact_rate_limits (
  scope VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  key_hash BINARY(32) NOT NULL,
  window_started_at DATETIME(3) NOT NULL,
  attempt_count INT UNSIGNED NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  PRIMARY KEY (scope, key_hash),
  INDEX contact_rate_limits_updated_idx (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

