# Digital Library

Digital Library adalah aplikasi perpustakaan digital berbasis web yang memungkinkan pengguna untuk meminjam, mengembalikan, dan mengelola koleksi buku secara online. Sistem ini mendukung fitur peminjaman buku, pengembalian, pembayaran denda, serta dashboard admin untuk pengelolaan data anggota dan buku.

## Fitur Utama

- **Peminjaman & Pengembalian Buku**: Pengguna dapat meminjam dan mengembalikan buku secara online.
- **Manajemen Buku & Anggota**: Admin dapat menambah, mengedit, dan menghapus data buku serta anggota.
- **Pembayaran Denda**: Mendukung pembayaran denda keterlambatan dengan berbagai metode pembayaran digital.
- **Dashboard Admin**: Statistik dan pengelolaan data perpustakaan secara real-time.
- **Notifikasi & Riwayat**: Pengguna dapat melihat riwayat peminjaman dan status pembayaran.

## Teknologi yang Digunakan

- **Next.js** (React Framework)
- **TypeScript**
- **Tailwind CSS** & **PostCSS**
- **MySQL** (Database)
- **Node.js** (Backend API)

## Cara Menjalankan Project

### 1. Persiapan Lingkungan

- Pastikan sudah menginstall [Node.js](https://nodejs.org/) (versi sesuai `.nvmrc`)
- Install [pnpm](https://pnpm.io/) jika belum:
  ```sh
  npm install -g pnpm
  ```

### 2. Clone Repository

```sh
git clone https://github.com/Maaulln/digital_Library.git
cd digital_Library
```

### 3. Install Dependencies

```sh
npm install
```

### 4. Konfigurasi Database

- Pastikan MySQL sudah berjalan di komputer Anda.
- Buat database baru dengan nama `digital_library`.
- Buat tabel dengan query di `database/schema.sql`.
- Buat database sesuai konfigurasi di file [`lib/database-config.js`](lib/database-config.js) atau gunakan endpoint debug:
  ```sh
  curl http://localhost:3000/api/debug/create-database
  ```
- Sesuaikan konfigurasi database jika diperlukan.

### 5. Jalankan Development Server

```sh
npm run dev
```
Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

### 6. Build untuk Produksi

```sh
npm build
npm start
```

## Struktur Direktori

- `app/` — Source code aplikasi Next.js (pages, API routes, layout)
- `components/` — Komponen UI reusable
- `hooks/` — Custom React hooks
- `lib/` — Utility dan konfigurasi
- `public/` — File statis (gambar, dll)
- `styles/` — File CSS global

## Kontribusi

Kontribusi sangat terbuka! Silakan buat pull request atau buka issue untuk diskusi lebih lanjut.

---

**Digital Library** — Solusi modern untuk manajemen perpustakaan digital.