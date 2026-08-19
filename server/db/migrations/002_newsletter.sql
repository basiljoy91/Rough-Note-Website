CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  subscriber_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  email_normalized VARCHAR(254) NOT NULL,
  subscription_status VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  source VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  subscription_requested_at DATETIME(3) NOT NULL,
  consent_confirmed_at DATETIME(3) NULL,
  unsubscribed_at DATETIME(3) NULL,
  verification_token_hash BINARY(32) NULL,
  verification_expires_at DATETIME(3) NULL,
  unsubscribe_token_hash BINARY(32) NOT NULL,
  verification_dispatch_started_at DATETIME(3) NULL,
  last_verification_sent_at DATETIME(3) NULL,
  client_ip_hash BINARY(32) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY newsletter_subscribers_email_unique (email_normalized),
  UNIQUE KEY newsletter_subscribers_verification_token_unique (verification_token_hash),
  UNIQUE KEY newsletter_subscribers_unsubscribe_token_unique (unsubscribe_token_hash),
  INDEX newsletter_subscribers_status_idx (subscription_status, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS newsletter_consent_events (
  consent_event_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  subscriber_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  event_type VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  source VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  event_at DATETIME(3) NOT NULL,
  INDEX newsletter_consent_events_subscriber_idx (subscriber_id, event_at),
  CONSTRAINT newsletter_consent_events_subscriber_fk
    FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers (subscriber_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS newsletter_notifications (
  notification_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  subscriber_id CHAR(29) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  notification_kind VARCHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  delivery_status VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  provider_message_id VARCHAR(255) NULL,
  error_message VARCHAR(1000) NULL,
  created_at DATETIME(3) NOT NULL,
  last_attempt_at DATETIME(3) NULL,
  sent_at DATETIME(3) NULL,
  INDEX newsletter_notifications_subscriber_idx (subscriber_id, created_at),
  INDEX newsletter_notifications_status_idx (delivery_status, created_at),
  CONSTRAINT newsletter_notifications_subscriber_fk
    FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers (subscriber_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

