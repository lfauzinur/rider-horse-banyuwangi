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
  member_id?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  service_id?: string | null;
  service_name?: string | null;
  payment_plan?: 'dp' | 'full';
  payment_status?: 'unpaid' | 'dp_paid' | 'paid' | 'refunded';
  dp_amount?: number;
  paid_amount?: number;
  outstanding_amount?: number;
  payment_method?: string | null;
  created_by?: 'member' | 'admin';
  referral_code?: string | null;
  // Joined fields
  trip?: Trip;
  user?: User;
}

export interface OperationalMember {
  id: string;
  auth_user_id?: string | null;
  email: string;
  full_name: string;
  phone_number: string;
  address?: string | null;
  riding_level: 'Beginner' | 'Intermediate' | 'Advanced';
  helmet_size?: string | null;
  boot_size?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  referral_code: string;
  referred_by?: string | null;
  referral_balance: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  member_id: string;
  member_name: string;
  type: 'dp' | 'settlement' | 'full' | 'refund';
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'refunded';
  paid_at: string;
  created_by: 'member' | 'admin';
}

export interface ReferralRecord {
  id: string;
  referrer_member_id: string;
  referrer_name: string;
  code: string;
  referred_name: string;
  booking_id?: string | null;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
}

export interface MemberFeedback {
  id: string;
  member_id: string | null;
  auth_user_id?: string | null;
  member_name: string;
  type: 'testimonial' | 'suggestion';
  rating: number;
  message: string;
  status: 'pending' | 'published' | 'archived';
  created_at: string;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
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
