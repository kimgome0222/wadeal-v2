-- Seller settlement payout request columns (apply locally when ready).

ALTER TABLE public.settlement_records
  ADD COLUMN IF NOT EXISTS payout_bank_name TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_number TEXT,
  ADD COLUMN IF NOT EXISTS payout_account_holder TEXT,
  ADD COLUMN IF NOT EXISTS payout_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payout_reject_reason TEXT,
  ADD COLUMN IF NOT EXISTS payout_rejected_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TYPE seller_settlement_record_status ADD VALUE IF NOT EXISTS 'payout_requested';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE seller_settlement_record_status ADD VALUE IF NOT EXISTS 'payout_rejected';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
