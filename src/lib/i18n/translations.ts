// ===========================================
// Rider Horse – Translation System
// ===========================================

export type Locale = 'id' | 'en';

export const translations = {
  id: {
    // Navbar
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      services: 'Layanan',
      trips: 'Trip',
      articles: 'Artikel',
      contact: 'Kontak',
      signIn: 'Masuk',
      bookTrip: 'Pesan Trip',
    },
    // Hero
    hero: {
      badge: '#1 Pengalaman Berkuda di Banyuwangi',
      headline: 'Kuasai Seni\nBerkuda',
      subheadline:
        'Rider Horse menyediakan pelatihan berkuda berkualitas tinggi dengan instruktur bersertifikat, membantu kamu merasakan keindahan alam Banyuwangi di atas pelana.',
      cta1: 'Mulai Berkuda',
      cta2: 'Pelajari Lebih',
      scheduleInfo: [
        'Senin – Rabu: 07.00 – 18.00',
        'Kamis – Jumat: 08.00 – 17.00',
        'Sabtu – Minggu: 08.00 – 16.00',
      ],
      stats: {
        riders: { value: '836+', label: 'Total Rider' },
        hours: { value: '20K+', label: 'Jam Latihan' },
        success: { value: '99%', label: 'Tingkat Puas' },
      },
    },
    // About
    about: {
      badge: 'Tentang Kami',
      headline: 'Perjalananmu Menuju\nBerkuda Profesional',
      description:
        'Rider Horse menawarkan pelatihan berkuda berkualitas tinggi untuk semua level. Dengan instruktur berpengalaman dan fasilitas terbaik, kami memastikan setiap pengalaman berkuda aman, menyenangkan, dan berkesan di alam Banyuwangi.',
      cta: 'Mulai Berkuda',
      phone: 'Hubungi Kami',
      stats: {
        riders: { value: '836+', label: 'Total Rider' },
        hours: { value: '20K+', label: 'Jam Latihan' },
        success: { value: '99%', label: 'Tingkat Puas' },
      },
      safetyItems: ['Helm Bersertifikat', 'Briefing Keamanan', 'Kuda Sehat', 'Siap P3K', 'GPS Tracking'],
    },
    // Services
    services: {
      badge: 'Program Kami',
      headline: 'Temukan Program Kami',
      description:
        'Jelajahi berbagai program berkuda yang dirancang untuk semua level, dari pemula hingga mahir.',
      suitableFor: 'Cocok Untuk',
      whatLearn: 'Yang Akan Dipelajari',
      joinProgram: 'Ikut Program',
      seeDetails: 'Lihat Detail',
      startFrom: 'Mulai dari',
    },
    // Trips
    trips: {
      badge: 'Petualangan Kami',
      headline: 'Pilih Petualanganmu',
      description:
        'Eksplorasi koleksi trip equestrian pilihan kami, dari pantai yang tenang hingga puncak gunung yang menantang.',
      filterAll: 'Semua Trip',
      viewAll: 'Lihat Semua Trip',
      bookNow: 'Pesan Sekarang',
      startFrom: 'Mulai dari',
      perPax: '/orang',
      maxCapacity: 'Maks',
      pax: 'orang',
      noTrips: 'Tidak ada trip untuk kategori ini.',
    },
    // Testimonials
    testimonials: {
      badge: 'Testimoni',
      headline: 'Cerita Nyata dari\nRider Kami',
      description:
        'Pelajari bagaimana program kami telah membantu para rider mencapai tujuan mereka.',
      seeAll: 'Lihat Semua Testimoni',
    },
    // Articles
    articles: {
      badge: 'Rider Journal',
      headline: 'Cerita dan wawasan dari dunia berkuda.',
      viewAll: 'Lihat Semua Artikel',
    },
    // Contact
    contact: {
      badge: 'Hubungi Kami',
      headline: 'Siap untuk Berkuda?',
      description: 'Ada pertanyaan? Kami siap membantu. Kirim pesan dan kami akan membalas secepatnya.',
      infoTitle: 'Informasi Kontak',
      formTitle: 'Kirim Pesan',
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Nama lengkap kamu',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'kamu@email.com',
      phoneLabel: 'Nomor HP / WhatsApp',
      phonePlaceholder: '+62 xxx xxxx xxxx',
      messageLabel: 'Pesan',
      messagePlaceholder: 'Ceritakan apa yang ingin kamu tanyakan...',
      submitBtn: 'Kirim via WhatsApp',
      submittedBtn: 'Pesan Terkirim! ✓',
      whatsappBtn: 'Chat via WhatsApp',
      labels: {
        phone: 'Telepon',
        email: 'Email',
        address: 'Alamat',
        hours: 'Jam Operasional',
      },
      mapLink: 'Buka di Google Maps →',
    },
    // Footer
    footer: {
      description: 'Menciptakan pengalaman berkuda tak terlupakan di jantung alam Banyuwangi sejak 2018.',
      explore: 'Jelajahi',
      ourTrips: 'Trip Kami',
      contact: 'Kontak',
      legal: {
        privacy: 'Kebijakan Privasi',
        terms: 'Syarat Layanan',
        cancellation: 'Kebijakan Pembatalan',
      },
      copyright: '2025 Rider Horse. Hak cipta dilindungi.',
      madeWith: 'Dibuat dengan',
      inBanyuwangi: 'di Banyuwangi',
    },
    // Login
    login: {
      title: 'Selamat Datang',
      subtitle: 'Masuk ke akun Rider Horse kamu',
      emailLabel: 'Email',
      emailPlaceholder: 'masukkan email kamu',
      passwordLabel: 'Password',
      passwordPlaceholder: 'masukkan password',
      submitBtn: 'Masuk',
      loadingBtn: 'Memproses...',
      noAccount: 'Belum punya akun?',
      register: 'Daftar sekarang',
      forgotPassword: 'Lupa password?',
      backHome: 'Kembali ke Beranda',
    },
    // Trip detail
    tripDetail: {
      back: 'Kembali ke Trip',
      notFound: 'Trip tidak ditemukan.',
      backBtn: 'Lihat Semua Trip',
      duration: 'Durasi',
      capacity: 'Kapasitas',
      difficulty: 'Tingkat',
      perPax: '/orang',
      highlights: 'Yang Termasuk',
      bookNow: 'Pesan Sekarang',
      whatsapp: 'Tanya via WhatsApp',
      startFrom: 'Mulai dari',
      minutes: 'menit',
      hours: 'jam',
      pax: 'orang',
    },
    // Common
    common: {
      hours: 'jam',
      minutes: 'menit',
    },
  },

  en: {
    // Navbar
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      trips: 'Trips',
      articles: 'Articles',
      contact: 'Contact',
      signIn: 'Sign In',
      bookTrip: 'Book a Trip',
    },
    // Hero
    hero: {
      badge: '#1 Equestrian Experience in Banyuwangi',
      headline: 'Learn the Art\nof Horse Riding',
      subheadline:
        'Rider Horse provides high-quality horse riding training with certified instructors, helping you experience the beauty of Banyuwangi from the saddle.',
      cta1: 'Start Riding',
      cta2: 'Learn More',
      scheduleInfo: [
        'Monday – Wednesday: 07:00 – 18:00',
        'Thursday – Friday: 08:00 – 17:00',
        'Saturday – Sunday: 08:00 – 16:00',
      ],
      stats: {
        riders: { value: '836+', label: 'Total Riders' },
        hours: { value: '20K+', label: 'Training Hours' },
        success: { value: '99%', label: 'Success Rate' },
      },
    },
    // About
    about: {
      badge: 'About Us',
      headline: 'Your Journey to Expert\nRiding at Rider Horse',
      description:
        "Rider Horse offers high-quality horse riding training for all levels. With experienced trainers and top-notch facilities, we ensure a safe, enjoyable, and educational experience in the heart of Banyuwangi's nature.",
      cta: 'Start Riding',
      phone: 'Call Us',
      stats: {
        riders: { value: '836+', label: 'Total Riders' },
        hours: { value: '20K+', label: 'Training Hours' },
        success: { value: '99%', label: 'Success Rate' },
      },
      safetyItems: ['Certified Helmets', 'Safety Briefing', 'Vet-Checked Horses', 'First Aid Ready', 'GPS Tracking'],
    },
    // Services
    services: {
      badge: 'Our Programs',
      headline: 'Discover Our Programs',
      description:
        'Explore a range of horse riding programs designed for all skill levels, from beginners to advanced riders.',
      suitableFor: 'Suitable for',
      whatLearn: "What You'll Learn",
      joinProgram: 'Join Program',
      seeDetails: 'See Details',
      startFrom: 'Start From',
    },
    // Trips
    trips: {
      badge: 'Our Adventures',
      headline: 'Choose Your Journey',
      description:
        'Explore our curated selection of equestrian experiences, from peaceful coastal rides to thrilling mountain summits.',
      filterAll: 'All Trips',
      viewAll: 'View All Trips',
      bookNow: 'Book Now',
      startFrom: 'Starting from',
      perPax: '/pax',
      maxCapacity: 'Max',
      pax: 'pax',
      noTrips: 'No trips found for this category.',
    },
    // Testimonials
    testimonials: {
      badge: 'Testimonials',
      headline: 'Real Stories From\nOur Riders',
      description: 'Learn how our training programs have helped riders achieve their goals.',
      seeAll: 'See All Testimonials',
    },
    // Articles
    articles: {
      badge: 'Rider Journal',
      headline: 'Stories and insight from the riding world.',
      viewAll: 'View All Articles',
    },
    // Contact
    contact: {
      badge: 'Get In Touch',
      headline: 'Ready to Ride?',
      description: "Have questions? We'd love to hear from you. Send a message and we'll respond quickly.",
      infoTitle: 'Contact Information',
      formTitle: 'Send Us a Message',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@email.com',
      phoneLabel: 'Phone / WhatsApp',
      phonePlaceholder: '+62 xxx xxxx xxxx',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell us what you would like to ask...',
      submitBtn: 'Send via WhatsApp',
      submittedBtn: 'Message Sent! ✓',
      whatsappBtn: 'Chat via WhatsApp',
      labels: {
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        hours: 'Operating Hours',
      },
      mapLink: 'Open in Google Maps →',
    },
    // Footer
    footer: {
      description: 'Creating unforgettable equestrian experiences in the heart of Banyuwangi nature since 2018.',
      explore: 'Explore',
      ourTrips: 'Our Trips',
      contact: 'Contact',
      legal: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cancellation: 'Cancellation Policy',
      },
      copyright: '2025 Rider Horse. All rights reserved.',
      madeWith: 'Made with',
      inBanyuwangi: 'in Banyuwangi',
    },
    // Login
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your Rider Horse account',
      emailLabel: 'Email',
      emailPlaceholder: 'enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'enter your password',
      submitBtn: 'Sign In',
      loadingBtn: 'Signing in...',
      noAccount: "Don't have an account?",
      register: 'Register now',
      forgotPassword: 'Forgot password?',
      backHome: 'Back to Home',
    },
    // Trip detail
    tripDetail: {
      back: 'Back to Trips',
      notFound: 'Trip not found.',
      backBtn: 'View All Trips',
      duration: 'Duration',
      capacity: 'Capacity',
      difficulty: 'Difficulty',
      perPax: '/pax',
      highlights: 'Highlights',
      bookNow: 'Book Now',
      whatsapp: 'Ask via WhatsApp',
      startFrom: 'Starting from',
      minutes: 'minutes',
      hours: 'hours',
      pax: 'pax',
    },
    // Common
    common: {
      hours: 'hours',
      minutes: 'minutes',
    },
  },
};

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
    ? readonly string[]
    : DeepStringRecord<T[K]>;
};

export type TranslationsType = DeepStringRecord<typeof translations.id>;
export type TranslationKeys = TranslationsType;
