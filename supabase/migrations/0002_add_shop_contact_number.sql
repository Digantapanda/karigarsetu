-- Adds a column that was missing from 0001 but is written to by the
-- registration flow and read by the public profile page's WhatsApp/Call
-- buttons. Safe to run even if you already ran 0001 -- uses IF NOT EXISTS.

alter table craftsman_profiles
  add column if not exists shop_contact_number text;
