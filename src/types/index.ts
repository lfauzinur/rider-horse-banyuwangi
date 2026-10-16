// ===========================================
// Database Entity Types
// ===========================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: 'member' | 'admin';
  riding_level: 'Beginner' | 'Intermediate' | 'Advanced';
  helmet_size: string | null;
  boot_size: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  duration_minutes: number;
  price: number;
  difficulty_level: 'Easy' | 'Moderate' | 'Challenging';
  max_capacity: number;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  category: 'beach_ride' | 'forest_trail' | 'sunset_ride' | 'mountain_trail' | 'private_lesson' | 'group_class';
  highlights: string[] | null;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  booking_date: string;
  time_slot: string;
  pax_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  qr_code_token: string | null;
  special_requests: string | null;
  created_at: string;
  // Joined fields
  trip?: Trip;
  user?: User;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

// ===========================================
// UI / Component Types
// ===========================================

export interface ServiceItem {
  icon: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  features: string[];
  featuresId: string[];
  price: number;
  suitableFor: string[];
  suitableForId: string[];
}

export interface TripCardProps {
  trip: Trip;
  onBook?: (trip: Trip) => void;
}

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface DashboardStats {
  totalBookings: number;
  activeTrips: number;
  totalMembers: number;
  revenue: number;
}
