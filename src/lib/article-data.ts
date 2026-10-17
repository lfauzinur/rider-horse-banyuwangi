import type { Article } from '@/types';

export const seededArticles: Article[] = [
  {
    id: 'article-1', title: 'Panduan Berkuda Pertama untuk Pemula', slug: 'panduan-berkuda-pertama-untuk-pemula',
    excerpt: 'Persiapan sederhana agar pengalaman berkuda pertamamu terasa aman, nyaman, dan menyenangkan.',
    content: 'Berkuda untuk pertama kali tidak harus terasa menegangkan. Datanglah 20–30 menit lebih awal agar kamu punya cukup waktu untuk mengenal instruktur, perlengkapan, dan kuda yang akan menjadi partner perjalananmu.\n\nGunakan celana panjang yang lentur, sepatu tertutup dengan hak rendah, dan hindari aksesori yang mudah tersangkut. Helm berkuda wajib dipakai selama sesi, bahkan ketika kamu hanya berlatih di arena.\n\nHal terpenting adalah tetap tenang dan mengikuti arahan instruktur. Kuda sangat peka terhadap bahasa tubuh. Napas yang teratur, gerakan lembut, dan komunikasi yang konsisten akan membantu membangun rasa percaya sejak awal.',
    cover_image_url: '/images/private-lesson.jpg', author: 'Tim Rider Horse', published_at: '2026-10-12', is_published: true, created_at: '2026-10-12',
  },
  {
    id: 'article-2', title: 'Menyiapkan Diri untuk Sunset Beach Ride', slug: 'menyiapkan-diri-untuk-sunset-beach-ride',
    excerpt: 'Checklist perlengkapan dan waktu terbaik untuk menikmati perjalanan berkuda di pesisir Banyuwangi.',
    content: 'Sunset Beach Ride menggabungkan pengalaman berkuda dengan perubahan cahaya yang cepat di pesisir. Pilih pakaian berwarna netral, gunakan tabir surya, dan bawa lapisan luar yang ringan karena angin pantai dapat terasa lebih sejuk menjelang malam.\n\nSimpan barang pribadi di tas kecil yang aman. Ponsel sebaiknya menggunakan tali pengaman dan hanya digunakan ketika instruktur menyatakan kondisi aman untuk mengambil foto.\n\nTim kami memantau cuaca, kondisi pasang, dan karakter setiap kuda sebelum keberangkatan. Karena itu, jadwal dapat disesuaikan demi keselamatan dan kualitas pengalaman seluruh rider.',
    cover_image_url: '/images/beach-ride.jpg', author: 'Tim Trail Rider Horse', published_at: '2026-10-08', is_published: true, created_at: '2026-10-08',
  },
  {
    id: 'article-3', title: 'Cara Membangun Kepercayaan dengan Kuda', slug: 'cara-membangun-kepercayaan-dengan-kuda',
    excerpt: 'Mengenali bahasa tubuh kuda dan menciptakan komunikasi yang tenang sebelum naik ke pelana.',
    content: 'Hubungan yang baik dengan kuda dimulai sebelum kamu berada di atas pelana. Dekati kuda dari arah yang dapat dilihatnya, biarkan ia mengenali kehadiranmu, lalu ikuti arahan handler untuk menyentuh bagian leher atau bahunya.\n\nPerhatikan posisi telinga, kepala, dan ketegangan tubuh. Telinga yang bergerak aktif biasanya menandakan kuda sedang memperhatikan lingkungan, sementara tubuh yang rileks menunjukkan ia merasa aman.\n\nKonsistensi adalah kunci. Gunakan instruksi yang jelas, berikan jeda agar kuda dapat merespons, dan hindari gerakan mendadak. Kepercayaan dibangun melalui interaksi kecil yang positif dan berulang.',
    cover_image_url: '/images/group-class.jpg', author: 'Coach Rider Horse', published_at: '2026-10-02', is_published: true, created_at: '2026-10-02',
  },
];
