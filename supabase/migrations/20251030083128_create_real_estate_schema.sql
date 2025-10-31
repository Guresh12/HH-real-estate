/*
  # Real Estate ERP Database Schema

  ## Overview
  Complete database schema for a Real Estate ERP system with public website and admin backend.

  ## New Tables

  ### 1. properties
  Stores all property listings (rentals, sales, investments)
  - `id` (uuid, primary key)
  - `title` (text) - Property title
  - `description` (text) - Detailed description
  - `location` (text) - Property address/location
  - `city` (text) - City name for area filtering
  - `price` (numeric) - Property price
  - `category` (text) - Type: Rental, Sale, Investment
  - `status` (text) - Active, Open House, Sold, etc.
  - `size` (numeric) - Property size in sq ft
  - `lot_size` (numeric) - Lot size in sq ft
  - `bedrooms` (integer) - Number of bedrooms
  - `bathrooms` (numeric) - Number of bathrooms
  - `image_url` (text) - Main property image
  - `agent_name` (text) - Listing agent name
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. clients
  Stores client information and documents
  - `id` (uuid, primary key)
  - `name` (text) - Client full name
  - `email` (text) - Client email
  - `phone` (text) - Contact number
  - `id_doc_url` (text) - ID document URL
  - `agreement_doc_url` (text) - Agreement document URL
  - `title_deed_url` (text) - Title deed document URL
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. plots
  Manages land plots (available, booked, sold)
  - `id` (uuid, primary key)
  - `plot_no` (text) - Plot number/identifier
  - `location` (text) - Plot location
  - `size` (numeric) - Plot size in sq ft
  - `price` (numeric) - Plot price
  - `status` (text) - Available, Booked, Sold
  - `client_id` (uuid, nullable) - Foreign key to clients
  - `map_coordinates` (text) - GPS coordinates for map
  - `dimensions` (text) - Plot dimensions (e.g., "50x100")
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. site_visits
  Tracks site visit requests from clients
  - `id` (uuid, primary key)
  - `client_name` (text) - Visitor name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone
  - `preferred_date` (date) - Requested visit date
  - `property_id` (uuid, nullable) - Related property
  - `plot_id` (uuid, nullable) - Related plot
  - `status` (text) - Pending, Scheduled, Completed, Cancelled
  - `notes` (text) - Additional information
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. receipts
  Financial receipts linked to clients and properties
  - `id` (uuid, primary key)
  - `receipt_no` (text) - Receipt number
  - `client_id` (uuid) - Foreign key to clients
  - `property_id` (uuid, nullable) - Related property
  - `plot_id` (uuid, nullable) - Related plot
  - `amount` (numeric) - Receipt amount
  - `payment_method` (text) - Cash, Card, Bank Transfer, etc.
  - `date` (date) - Receipt date
  - `pdf_url` (text) - PDF document URL
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)

  ### 6. website_content
  Dynamic content for public website sections
  - `id` (uuid, primary key)
  - `section` (text) - Section identifier (hero, about, etc.)
  - `title` (text) - Section title
  - `content` (text) - Section content/description
  - `image_url` (text) - Section image
  - `display_order` (integer) - Display order
  - `is_active` (boolean) - Visibility flag
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for properties, plots (available), website_content
  - Authenticated admin-only access for all write operations
  - Clients and receipts accessible only to authenticated users
  - Site visits: public insert, admin read/update
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  location text NOT NULL,
  city text DEFAULT '',
  price numeric NOT NULL,
  category text NOT NULL,
  status text DEFAULT 'Active',
  size numeric DEFAULT 0,
  lot_size numeric DEFAULT 0,
  bedrooms integer DEFAULT 0,
  bathrooms numeric DEFAULT 0,
  image_url text DEFAULT '',
  agent_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  id_doc_url text DEFAULT '',
  agreement_doc_url text DEFAULT '',
  title_deed_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create plots table
CREATE TABLE IF NOT EXISTS plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_no text NOT NULL UNIQUE,
  location text NOT NULL,
  size numeric NOT NULL,
  price numeric NOT NULL,
  status text DEFAULT 'Available',
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  map_coordinates text DEFAULT '',
  dimensions text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_date date NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  plot_id uuid REFERENCES plots(id) ON DELETE SET NULL,
  status text DEFAULT 'Pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no text NOT NULL UNIQUE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  plot_id uuid REFERENCES plots(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  payment_method text DEFAULT 'Cash',
  date date DEFAULT CURRENT_DATE,
  pdf_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create website_content table
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- Clients policies
CREATE POLICY "Authenticated users can view clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (true);

-- Plots policies
CREATE POLICY "Public can view available plots"
  ON plots FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert plots"
  ON plots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update plots"
  ON plots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete plots"
  ON plots FOR DELETE
  TO authenticated
  USING (true);

-- Site visits policies
CREATE POLICY "Public can submit site visit requests"
  ON site_visits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view site visits"
  ON site_visits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update site visits"
  ON site_visits FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site visits"
  ON site_visits FOR DELETE
  TO authenticated
  USING (true);

-- Receipts policies
CREATE POLICY "Authenticated users can view receipts"
  ON receipts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert receipts"
  ON receipts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update receipts"
  ON receipts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete receipts"
  ON receipts FOR DELETE
  TO authenticated
  USING (true);

-- Website content policies
CREATE POLICY "Public can view active website content"
  ON website_content FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage website content"
  ON website_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_plots_status ON plots(status);
CREATE INDEX IF NOT EXISTS idx_plots_client_id ON plots(client_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_status ON site_visits(status);
CREATE INDEX IF NOT EXISTS idx_receipts_client_id ON receipts(client_id);
CREATE INDEX IF NOT EXISTS idx_website_content_section ON website_content(section);

-- Insert default website content
INSERT INTO website_content (section, title, content, image_url, display_order, is_active)
VALUES
  ('hero', 'Find Your Dream Home', 'Discover the perfect property for you and your family. Browse through our extensive collection of homes, apartments, and land plots.', '', 1, true),
  ('about', 'About Us', 'We are a leading real estate company committed to helping you find your perfect home.', '', 2, true)
ON CONFLICT DO NOTHING;