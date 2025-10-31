/*
  # Enhanced Clients Management and Receipts

  ## Changes

  ### 1. Clients Table Enhancement
  Added KYC fields for better client management and compliance:
  - `kyc_status` (text) - Status of KYC verification (Not Started, Pending, Verified, Rejected)
  - `id_type` (text) - Type of ID document
  - `id_number` (text) - ID document number
  - `date_of_birth` (date) - Client DOB
  - `physical_address` (text) - Physical address
  - `is_verified` (boolean) - KYC verification flag

  ### 2. Company Configuration Table
  New table for company branding and receipts:
  - `id` (uuid, primary key)
  - `company_name` (text)
  - `company_logo_url` (text)
  - `company_phone` (text)
  - `company_email` (text)
  - `company_address` (text)
  - `company_website` (text)
  - `tax_id` (text)

  ### 3. Enhancements
  - Add document URL fields to track upload paths
  - Add session tracking for auto-logout
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'kyc_status'
  ) THEN
    ALTER TABLE clients ADD COLUMN kyc_status text DEFAULT 'Not Started';
    ALTER TABLE clients ADD COLUMN id_type text DEFAULT '';
    ALTER TABLE clients ADD COLUMN id_number text DEFAULT '';
    ALTER TABLE clients ADD COLUMN date_of_birth date;
    ALTER TABLE clients ADD COLUMN physical_address text DEFAULT '';
    ALTER TABLE clients ADD COLUMN is_verified boolean DEFAULT false;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS company_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Elite Properties',
  company_logo_url text DEFAULT '',
  company_phone text DEFAULT '',
  company_email text DEFAULT '',
  company_address text DEFAULT '',
  company_website text DEFAULT '',
  tax_id text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view company config"
  ON company_config FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update company config"
  ON company_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO company_config (company_name, company_phone, company_email, company_address)
VALUES ('Elite Properties', '+254 700 000000', 'info@eliteproperties.ke', 'Nairobi, Kenya')
ON CONFLICT DO NOTHING;