# 📚 Sistem Manajemen Perpustakaan Digital

Sistem manajemen perpustakaan digital modern yang dibangun dengan Next.js, TypeScript, dan MySQL. Aplikasi ini menyediakan solusi komprehensif untuk mengelola operasi perpustakaan termasuk peminjaman buku, manajemen anggota, pemrosesan pembayaran, dan kontrol administratif.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Fitur-Fitur

### 📖 **Fitur Anggota**

- **Penelusuran Buku**: Jelajahi koleksi buku lengkap dengan kemampuan pencarian dan filter
- **Peminjaman Buku**: Sistem peminjaman buku online yang mudah dengan ketersediaan real-time
- **Riwayat Peminjaman**: Lacak riwayat peminjaman pribadi dan pinjaman saat ini
- **Sistem Pembayaran**: Pemrosesan pembayaran terintegrasi untuk denda keterlambatan
- **Manajemen Profil**: Perbarui informasi pribadi dan preferensi
- **Desain Responsif**: Dioptimalkan untuk desktop, tablet, dan perangkat mobile

### 👨‍💼 **Fitur Admin**

- **Analitik Dashboard**: Statistik dan wawasan real-time
- **Manajemen Buku**: Tambah, edit, hapus, dan kelola inventaris buku
- **Manajemen Anggota**: Tangani pendaftaran pengguna dan manajemen akun
- **Kontrol Peminjaman**: Pantau semua aktivitas peminjaman dan tanggal jatuh tempo
- **Pelacakan Pembayaran**: Lacak pembayaran denda dan laporan keuangan
- **Manajemen Konten**: Upload dan kelola sampul buku serta file PDF

### 🔧 **Fitur Teknis**

- **Sistem Autentikasi**: Login/logout aman dengan manajemen sesi
- **RESTful API**: Endpoint API yang terstruktur dengan baik untuk semua operasi
- **Upload File**: Dukungan untuk sampul buku dan konten PDF
- **Integrasi Database**: Database MySQL yang robust dengan relasi yang tepat
- **Penanganan Error**: Penanganan error yang komprehensif dan feedback pengguna
- **TypeScript**: Keamanan tipe penuh di seluruh aplikasi

## 🚀 Teknologi yang Digunakan

- **Frontend**: Next.js 15.2.4, React 18, TypeScript
- **Styling**: Tailwind CSS, Komponen Radix UI
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL 8.0
- **Validasi**: Zod, React Hook Form
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifikasi**: Sonner

## 📋 Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- **Node.js** (v18 atau lebih tinggi)
- **pnpm** package manager
- **MySQL** (v8.0 atau lebih tinggi)
- **Docker** (opsional, untuk database containerized)

## 🛠️ Instalasi & Pengaturan

### 1. Clone Repository

```bash
git clone https://github.com/Maaulln/digital_Library
cd digital-library
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Pengaturan Database

#### Opsi A: Menggunakan Docker (Direkomendasikan)

```bash
# Mulai MySQL container dengan port mapping
docker run -d --name mysql_server \
  --network docker-mysql_app-network \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD="" \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=my_library \
  mysql:8.0

# Import schema database
docker exec -i mysql_server mysql -u root my_library < digital_library.sql
```

#### Opsi B: Instalasi MySQL Lokal

1. Buat database baru dengan nama `my_library`
2. Import schema:

```bash
mysql -u root -p my_library < digital_library.sql
```

### 4. Konfigurasi Environment

Perbarui konfigurasi database di `/app/api/database-config.js`:

```javascript
export const dbConfig = {
  host: "localhost",
  port: 3307, // Gunakan 3306 jika menggunakan MySQL lokal
  user: "root",
  password: "", // Tambahkan password Anda jika diperlukan
  database: "my_library",
};
```

### 5. Jalankan Development Server

```bash
pnpm dev
```

Aplikasi akan tersedia di `http://localhost:3000`

## 📁 Struktur Proyek

```
digital_Library-main/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoint autentikasi
│   │   ├── books/                # API manajemen buku
│   │   ├── borrowings/           # API sistem peminjaman
│   │   ├── payment/              # API pemrosesan pembayaran
│   │   ├── user/                 # API manajemen pengguna
│   │   └── database-config.js    # Konfigurasi database
│   ├── admin/                    # Halaman admin
│   ├── books/                    # Halaman penelusuran buku
│   ├── dashboard/                # Dashboard pengguna
│   ├── history/                  # Riwayat peminjaman
│   ├── my-books/                 # Buku pengguna saat ini
│   ├── profile/                  # Profil pengguna
│   └── register/                 # Halaman registrasi
├── components/                   # Komponen React yang dapat digunakan kembali
│   ├── ui/                       # Library komponen UI
│   ├── AddBookForm.tsx           # Form penambahan buku
│   ├── book-card.tsx             # Komponen tampilan buku
│   ├── admin-navbar.tsx          # Navigasi admin
│   └── member-navbar.tsx         # Navigasi anggota
├── lib/                          # Fungsi utilitas
├── public/                       # Aset statis
│   ├── uploads/                  # Gambar sampul buku
│   └── content/                  # File PDF
├── styles/                       # Style global
├── digital_library.sql           # Schema database
└── README.md                     # Dokumentasi proyek
```

## 🎯 Cara Penggunaan

### Untuk Anggota

1. **Daftar/Login**: Buat akun atau login dengan kredensial yang ada
2. **Telusuri Buku**: Jelajahi koleksi buku di dashboard
3. **Pinjam Buku**: Klik pada buku yang tersedia untuk meminjamnya
4. **Lihat Riwayat**: Periksa riwayat peminjaman Anda di bagian Riwayat
5. **Kelola Profil**: Perbarui informasi pribadi Anda di Profil

### Untuk Admin

1. **Akses Panel Admin**: Login dengan kredensial admin
2. **Dashboard**: Lihat statistik dan analitik perpustakaan
3. **Kelola Buku**: Tambah buku baru, perbarui yang ada, atau hapus buku
4. **Kelola Anggota**: Lihat dan kelola anggota perpustakaan
5. **Pantau Peminjaman**: Lacak semua aktivitas peminjaman dan buku yang terlambat

## 🔌 Endpoint API

### Autentikasi

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/logout` - Logout pengguna

### Buku

- `GET /api/books` - Dapatkan semua buku
- `GET /api/books/[id]` - Dapatkan buku tunggal
- `POST /api/books` - Tambah buku baru (admin)
- `PUT /api/books/[id]` - Perbarui buku (admin)
- `DELETE /api/books/[id]` - Hapus buku (admin)

### Peminjaman

- `GET /api/borrowings` - Dapatkan peminjaman pengguna
- `POST /api/borrowings` - Pinjam buku
- `PUT /api/borrowings/[id]` - Kembalikan buku

### Pengguna

- `GET /api/user/profile` - Dapatkan profil pengguna
- `PUT /api/user/profile` - Perbarui profil pengguna

## 🐳 Dukungan Docker

Proyek ini mencakup konfigurasi Docker untuk deployment yang mudah:

```bash
# Periksa container yang berjalan
docker ps

# Lihat log container
docker logs mysql_server

# Akses shell MySQL
docker exec -it mysql_server mysql -u root my_library
```

## 🧪 Testing

Tes koneksi database:

```bash
curl -X GET http://localhost:3000/api/debug/database
```

## 🤝 Berkontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/fitur-menakjubkan`)
3. Commit perubahan Anda (`git commit -m 'Tambah fitur menakjubkan'`)
4. Push ke branch (`git push origin feature/fitur-menakjubkan`)
5. Buka Pull Request

## 👨‍💻 Pembuat

**Tim Pengembang**

- GitHub: [@maaulln](https://github.com/maaulln)
- Email: maaullntech@gmail.com

## 🙏 Ucapan Terima Kasih

- [Next.js](https://nextjs.org/) untuk framework React yang luar biasa
- [Tailwind CSS](https://tailwindcss.com/) untuk framework CSS utility-first
- [Radix UI](https://www.radix-ui.com/) untuk primitif komponen yang dapat diakses
- [Lucide](https://lucide.dev/) untuk ikon yang indah

## 📞 Dukungan

Jika Anda memiliki pertanyaan atau membutuhkan dukungan, silakan:

1. Periksa halaman [Issues](https://github.com/Maaulln/digital_Library/issues)
2. Buat issue baru jika masalah Anda belum dilaporkan
3. Hubungi maintainer secara langsung

---

⭐ Jika Anda merasa proyek ini membantu, berikan bintang di GitHub!
