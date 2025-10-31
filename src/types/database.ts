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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
  client?: Client;
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
