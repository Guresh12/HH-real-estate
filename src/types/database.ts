export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: number;
  category: string;
  status: string;
  size: number;
  lot_size: number;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  agent_name: string;
  virtual_tour_id: string | null;
  primary_tour_id: string | null;
  created_at: string;
  updated_at: string;
  virtual_tour?: VirtualTour;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  id_doc_url: string;
  agreement_doc_url: string;
  title_deed_url: string;
  notes: string;
  kyc_status: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
  physical_address: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plot {
  id: string;
  plot_no: string;
  location: string;
  size: number;
  price: number;
  status: string;
  client_id: string | null;
  map_coordinates: string;
  dimensions: string;
  virtual_tour_id: string | null;
  primary_tour_id: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  virtual_tour?: VirtualTour;
}

export interface SiteVisit {
  id: string;
  client_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  property_id: string | null;
  plot_id: string | null;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  plot?: Plot;
}

export interface Receipt {
  id: string;
  receipt_no: string;
  client_id: string;
  property_id: string | null;
  plot_id: string | null;
  amount: number;
  payment_method: string;
  date: string;
  pdf_url: string;
  notes: string;
  created_at: string;
  client?: Client;
  property?: Property;
  plot?: Plot;
}

export interface WebsiteContent {
  id: string;
  section: string;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface VirtualTour {
  id: string;
  property_id: string | null;
  plot_id: string | null;
  tour_type: 'Kuula' | 'Matterport' | 'Embed' | 'External';
  tour_url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
