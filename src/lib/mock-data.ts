import type { Trip, Booking, ServiceItem } from '@/types';

// ===========================================
// Mock Trips Data (will be replaced by Supabase)
// ===========================================
export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Sunset Beach Ride',
    slug: 'sunset-beach-ride',
    description:
      'Rasakan keajaiban berkuda di sepanjang pesisir pantai Banyuwangi yang masih asri saat matahari melukis langit dengan warna keemasan. Trip ini membawa kamu menelusuri 5km garis pantai yang indah dengan deburan ombak sebagai latar belakang.',
    short_description: 'Berkuda di tepi pantai Banyuwangi saat matahari terbenam nan memukau.',
    duration_minutes: 90,
    price: 750000,
    difficulty_level: 'Easy',
    max_capacity: 6,
    cover_image_url: '/images/beach-ride.jpg',
    gallery_images: [],
    category: 'beach_ride',
    highlights: ['Jalur pantai 5km', 'Foto profesional termasuk', 'Snack ringan', 'Briefing keamanan'],
    is_active: true,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Forest Mountain Trail',
    slug: 'forest-mountain-trail',
    description:
      'Petualangan ke dalam hutan tropis Banyuwangi yang lebat dan mendaki jalur pegunungan dengan pemandangan spektakuler. Jalur ini melewati pohon-pohon beringin kuno, penyeberangan sungai, dan titik pandang bukit yang menakjubkan.',
    short_description: 'Jelajahi hutan lebat dan jalur pegunungan Banyuwangi yang indah.',
    duration_minutes: 150,
    price: 1200000,
    difficulty_level: 'Challenging',
    max_capacity: 4,
    cover_image_url: '/images/forest-trail.jpg',
    gallery_images: [],
    category: 'forest_trail',
    highlights: ['Pemandangan pegunungan', 'Penyeberangan sungai', 'Flora & fauna tropis', 'Makan siang termasuk'],
    is_active: true,
    created_at: '2024-01-20',
  },
  {
    id: '3',
    title: 'Golden Hour Sunset Ride',
    slug: 'golden-hour-sunset-ride',
    description:
      'Trip paling romantis dan populer kami. Berkuda melalui padang rumput terbuka saat golden hour menerangi segalanya dengan cahaya hangat. Termasuk toast champagne di titik pandang matahari terbenam Banyuwangi.',
    short_description: 'Berkuda di padang rumput Banyuwangi saat cahaya golden hour.',
    duration_minutes: 120,
    price: 950000,
    difficulty_level: 'Moderate',
    max_capacity: 4,
    cover_image_url: '/images/sunset-ride.jpg',
    gallery_images: [],
    category: 'sunset_ride',
    highlights: ['Toast champagne', 'Gallop di padang rumput', 'Drone footage profesional', 'Suasana romantis'],
    is_active: true,
    created_at: '2024-02-01',
  },
  {
    id: '4',
    title: 'Private Riding Lesson',
    slug: 'private-riding-lesson',
    description:
      'Instruksi satu-ke-satu dengan instruktur berkuda bersertifikat kami. Pelajari postur berkuda yang benar, komunikasi dengan kuda, dan gerakan dressage dasar. Setiap pelajaran disesuaikan dengan level dan tujuanmu.',
    short_description: 'Instruksi privat dengan instruktur berkuda bersertifikat kami.',
    duration_minutes: 60,
    price: 500000,
    difficulty_level: 'Easy',
    max_capacity: 1,
    cover_image_url: '/images/private-lesson.jpg',
    gallery_images: [],
    category: 'private_lesson',
    highlights: ['Instruktur bersertifikat', 'Semua perlengkapan disediakan', 'Kurikulum personal', 'Analisis video'],
    is_active: true,
    created_at: '2024-02-05',
  },
  {
    id: '5',
    title: 'Group Riding Class',
    slug: 'group-riding-class',
    description:
      'Bergabunglah dengan sesama rider dalam kelas grup yang menggabungkan pembelajaran dengan kesenangan sosial. Kelas mencakup dasar berkuda, perawatan kuda, dan teknik grooming. Cocok untuk team building.',
    short_description: 'Kelas berkuda kelompok yang menyenangkan dan berkesan.',
    duration_minutes: 90,
    price: 350000,
    difficulty_level: 'Easy',
    max_capacity: 8,
    cover_image_url: '/images/group-class.jpg',
    gallery_images: [],
    category: 'group_class',
    highlights: ['Suasana sosial', 'Dasar grooming kuda', 'Diskon grup tersedia', 'Sertifikat kelulusan'],
    is_active: true,
    created_at: '2024-02-10',
  },
  {
    id: '6',
    title: 'Mountain Summit Trail',
    slug: 'mountain-summit-trail',
    description:
      'Trip paling menantang kami membawa kamu ke puncak gunung di Banyuwangi dengan pemandangan panorama 360°. Navigasi jalur terjal, hutan lebat, dan medan berbatu. Hanya untuk rider berpengalaman.',
    short_description: 'Trip puncak gunung yang menantang dengan panorama 360° di Banyuwangi.',
    duration_minutes: 180,
    price: 1500000,
    difficulty_level: 'Challenging',
    max_capacity: 3,
    cover_image_url: '/images/mountain-trail.jpg',
    gallery_images: [],
    category: 'mountain_trail',
    highlights: ['Panorama puncak', 'Petualangan seharian', 'Makan siang gourmet', 'Pemandu berpengalaman'],
    is_active: true,
    created_at: '2024-02-15',
  },
];

// ===========================================
// Mock Bookings Data
// ===========================================
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    user_id: 'u1',
    trip_id: '1',
    booking_date: '2024-11-25',
    time_slot: '16:00',
    pax_count: 2,
    total_price: 1500000,
    status: 'confirmed',
    qr_code_token: 'RH-1700000000-ABC123',
    special_requests: null,
    created_at: '2024-11-10',
    trip: mockTrips[0],
  },
  {
    id: 'b2',
    user_id: 'u1',
    trip_id: '3',
    booking_date: '2024-12-01',
    time_slot: '17:00',
    pax_count: 2,
    total_price: 1900000,
    status: 'pending',
    qr_code_token: 'RH-1700000001-DEF456',
    special_requests: 'Perayaan ulang tahun',
    created_at: '2024-11-12',
    trip: mockTrips[2],
  },
  {
    id: 'b3',
    user_id: 'u1',
    trip_id: '4',
    booking_date: '2024-10-15',
    time_slot: '09:00',
    pax_count: 1,
    total_price: 500000,
    status: 'completed',
    qr_code_token: 'RH-1700000002-GHI789',
    special_requests: null,
    created_at: '2024-10-01',
    trip: mockTrips[3],
  },
];

// ===========================================
// Services Data
// ===========================================
export const services: ServiceItem[] = [
  {
    icon: 'graduation-cap',
    title: 'Private Lesson',
    titleId: 'Pelajaran Privat',
    description: 'One-on-one expert instruction tailored to your skill level, from beginner basics to advanced dressage.',
    descriptionId: 'Instruksi privat satu-ke-satu disesuaikan dengan level kemampuanmu, dari dasar hingga dressage tingkat lanjut.',
    features: ['Certified Instructor', 'All Equipment Provided', 'Video Analysis', 'Flexible Scheduling'],
    featuresId: ['Instruktur Bersertifikat', 'Semua Perlengkapan', 'Analisis Video', 'Jadwal Fleksibel'],
    price: 500000,
    suitableFor: ['First-time riders', 'Building confidence', 'Mastering basics'],
    suitableForId: ['Pertama kali berkuda', 'Membangun kepercayaan diri', 'Menguasai dasar-dasar'],
  },
  {
    icon: 'users',
    title: 'Group Class',
    titleId: 'Kelas Kelompok',
    description: 'Social riding experience with fellow enthusiasts. Learn, ride, and make lasting connections.',
    descriptionId: 'Pengalaman berkuda sosial bersama sesama penggemar. Belajar, berkuda, dan buat koneksi bermakna.',
    features: ['Small Groups (max 8)', 'Team Building', 'Horse Care Basics', 'Certificate'],
    featuresId: ['Kelompok Kecil (maks 8)', 'Team Building', 'Dasar Perawatan Kuda', 'Sertifikat'],
    price: 350000,
    suitableFor: ['Social learners', 'Team building', 'Budget-friendly option'],
    suitableForId: ['Pembelajaran sosial', 'Team building', 'Pilihan hemat'],
  },
  {
    icon: 'sparkles',
    title: 'Horse Grooming',
    titleId: 'Grooming Kuda',
    description: 'Learn the art of horse care. Brush, feed, and bond with our gentle horses in a guided session.',
    descriptionId: 'Pelajari seni merawat kuda. Sikat, beri makan, dan jalin ikatan dengan kuda-kuda kami dalam sesi terpandu.',
    features: ['Hands-on Experience', 'Horse Bonding', 'Care Techniques', 'Family Friendly'],
    featuresId: ['Pengalaman Langsung', 'Bonding dengan Kuda', 'Teknik Perawatan', 'Ramah Keluarga'],
    price: 200000,
    suitableFor: ['Animal lovers', 'Families', 'Stress relief'],
    suitableForId: ['Pecinta hewan', 'Keluarga', 'Relaksasi'],
  },
  {
    icon: 'camera',
    title: 'Documentation & Drone',
    titleId: 'Dokumentasi & Drone',
    description: 'Capture your equestrian moments with professional photography and cinematic drone footage.',
    descriptionId: 'Abadikan momen berkudamu dengan fotografi profesional dan rekaman drone sinematik.',
    features: ['Professional Photos', '4K Drone Video', 'Same-day Delivery', 'Social Media Ready'],
    featuresId: ['Foto Profesional', 'Video Drone 4K', 'Kirim di Hari yang Sama', 'Siap Media Sosial'],
    price: 300000,
    suitableFor: ['Content creators', 'Special occasions', 'Memory keeping'],
    suitableForId: ['Kreator konten', 'Acara spesial', 'Kenangan abadi'],
  },
];

// ===========================================
// Testimonials
// ===========================================
export const testimonials = [
  {
    id: 't1',
    name: 'Sari Dewi',
    location: 'Jakarta, Indonesia',
    avatar: null,
    rating: 5,
    text: 'Pengalaman berkuda di Rider Horse sangat luar biasa! Instrukturnya sangat sabar dan profesional. Pemandangan alam Banyuwangi yang memukau membuat setiap momen jadi tak terlupakan.',
    textEn: 'Horse riding at Rider Horse was absolutely amazing! The instructors are very patient and professional. The stunning natural scenery of Banyuwangi makes every moment unforgettable.',
    trip: 'Golden Hour Sunset Ride',
  },
  {
    id: 't2',
    name: 'Ahmad Fauzan',
    location: 'Surabaya, Indonesia',
    avatar: null,
    rating: 5,
    text: 'Saya membawa keluarga untuk group class dan semua sangat menikmatinya. Fasilitas bersih, kuda-kudanya jinak, dan staffnya ramah. Pasti akan balik lagi!',
    textEn: 'I brought my family for the group class and everyone loved it. Clean facilities, gentle horses, and friendly staff. Will definitely come back!',
    trip: 'Group Riding Class',
  },
  {
    id: 't3',
    name: 'Nadire Abigail',
    location: 'Banyuwangi, Indonesia',
    avatar: null,
    rating: 5,
    text: 'Sebagai warga lokal, saya bangga dengan keberadaan Rider Horse. Mereka benar-benar mengangkat pariwisata Banyuwangi dengan cara yang berkelanjutan dan profesional.',
    textEn: 'As a local resident, I am proud of Rider Horse. They truly elevate Banyuwangi tourism in a sustainable and professional way.',
    trip: 'Forest Mountain Trail',
  },
];

// ===========================================
// Site Content Defaults
// ===========================================
export const defaultSiteContent: Record<string, string> = {
  show_about: 'true',
  show_services: 'true',
  show_trips: 'true',
  show_testimonials: 'true',
  show_articles: 'true',
  show_contact: 'true',
  hero_image_url: '/images/hero-banner.png',
  about_primary_image_url: '/images/private-lesson.jpg',
  about_secondary_image_url: '/images/group-class.jpg',
  about_tertiary_image_url: '/images/forest-trail.jpg',
  testimonials_image_url: '/images/beach-ride.jpg',
  hero_headline: 'Rasakan Kebebasan Berkuda',
  hero_subheadline:
    'Jelajahi jalur yang menakjubkan, pelajaran profesional, dan petualangan equestrian yang tak terlupakan di jantung alam Banyuwangi.',
  about_title: 'Cerita Kami',
  about_text:
    'Didirikan dengan semangat terhadap kuda dan alam, Rider Horse telah menciptakan pengalaman equestrian yang tak terlupakan sejak 2018. Kandang kami menampung 12 kuda terlatih, masing-masing dengan kepribadian unik, dibimbing oleh instruktur bersertifikat dengan pengalaman gabungan lebih dari 15 tahun.',
  about_safety:
    'Keselamatan Anda adalah prioritas utama kami. Setiap perjalanan dimulai dengan briefing keselamatan komprehensif, dan semua rider dilengkapi dengan helm bersertifikat dan perlengkapan pelindung. Kuda-kuda kami dipilih dengan cermat berdasarkan temperamen dan diperiksa kesehatannya secara rutin oleh dokter hewan profesional.',
  contact_phone: '+62 812 3456 7890',
  contact_email: 'hello@riderhorse.id',
  contact_address: 'Jl. Pantai Boom No. 88, Banyuwangi, Jawa Timur, Indonesia',
  operating_hours: 'Setiap Hari: 07:00 - 18:00 WIB',
  whatsapp_number: '6281234567890',
};
