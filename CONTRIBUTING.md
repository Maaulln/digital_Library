# Panduan Kontribusi Sistem Manajemen Perpustakaan Digital

Terima kasih atas minat Anda untuk berkontribusi pada Sistem Manajemen Perpustakaan Digital kami! Dokumen ini menyediakan panduan dan informasi untuk kontributor.

## 🤝 Cara Berkontribusi

### Melaporkan Masalah

1. **Cari issue yang sudah ada** terlebih dahulu untuk menghindari duplikasi
2. **Gunakan template issue** jika tersedia
3. **Berikan informasi detail** termasuk:
   - Langkah-langkah untuk mereproduksi masalah
   - Perilaku yang diharapkan vs perilaku aktual
   - Detail lingkungan (OS, versi Node.js, dll.)
   - Screenshot atau pesan error jika ada

### Membuat Perubahan

1. **Fork repository**
2. **Buat feature branch** dari `main`:

   ```bash
   git checkout -b feature/nama-fitur-anda
   ```

3. **Buat perubahan Anda** mengikuti standar coding kami
4. **Test perubahan Anda** secara menyeluruh
5. **Commit perubahan Anda** dengan pesan yang jelas dan deskriptif
6. **Push ke fork Anda** dan buat pull request

## 📝 Panduan Pengembangan

### Gaya Kode

- **TypeScript**: Gunakan TypeScript untuk semua kode baru
- **Formatting**: Ikuti format kode yang sudah ada
- **ESLint**: Pastikan kode Anda lolos pemeriksaan linting
- **Komentar**: Tambahkan komentar yang bermakna untuk logika yang kompleks

### Panduan Komponen

- **Reusability**: Buat komponen yang dapat digunakan kembali jika memungkinkan
- **Props**: Gunakan interface TypeScript untuk props komponen
- **Penamaan**: Gunakan PascalCase untuk nama komponen
- **Struktur File**: Tempatkan komponen di direktori yang sesuai

### Pengembangan API

- **RESTful**: Ikuti konvensi REST untuk endpoint API
- **Penanganan Error**: Implementasikan penanganan error yang tepat dan kode status
- **Validasi**: Validasi semua data input
- **Database**: Gunakan praktik SQL yang tepat dan hindari SQL injection

### Database

- **Migrasi**: Sertakan skrip migrasi database untuk perubahan schema
- **Indeks**: Pertimbangkan performa database dan pengindeksan
- **Relasi**: Pertahankan relasi foreign key yang tepat
- **Keamanan**: Ikuti praktik keamanan database terbaik

## 🧪 Testing

- **Test perubahan Anda** pada perangkat dan browser yang berbeda
- **Testing database**: Test dengan data sampel
- **Testing API**: Gunakan tools seperti Postman atau curl untuk test endpoint
- **Skenario error**: Test penanganan error dan edge cases

## 📋 Proses Pull Request

1. **Perbarui dokumentasi** jika diperlukan
2. **Tambah/perbarui test** untuk fitur baru
3. **Pastikan semua pemeriksaan lolos** (linting, building, dll.)
4. **Tulis deskripsi PR yang jelas** menjelaskan:
   - Perubahan apa yang dibuat
   - Mengapa perubahan tersebut diperlukan
   - Cara menguji perubahan

### Template PR

```
## Deskripsi
Deskripsi singkat perubahan yang dibuat

## Jenis Perubahan
- [ ] Bug fix
- [ ] Fitur baru
- [ ] Update dokumentasi
- [ ] Refactoring
- [ ] Lainnya (jelaskan)

## Testing
- [ ] Tested secara lokal
- [ ] Test ditambah/diperbarui
- [ ] Manual testing selesai

## Checklist
- [ ] Kode mengikuti panduan style proyek
- [ ] Self-review selesai
- [ ] Dokumentasi diperbarui jika diperlukan
- [ ] Tidak ada warning atau error baru yang diperkenalkan
```

## 🔧 Setup Development

1. **Fork dan clone repository**
2. **Install dependencies**: `pnpm install`
3. **Setup database** mengikuti instruksi README
4. **Start development server**: `pnpm dev`
5. **Buat perubahan Anda**
6. **Test secara menyeluruh**

## 📚 Sumber Daya

- **Dokumentasi Next.js**: https://nextjs.org/docs
- **Dokumentasi TypeScript**: https://www.typescriptlang.org/docs
- **Dokumentasi Tailwind CSS**: https://tailwindcss.com/docs
- **Dokumentasi MySQL**: https://dev.mysql.com/doc

## 🎯 Area untuk Kontribusi

Kami menyambut kontribusi di area berikut:

### Frontend

- Perbaikan UI/UX
- Peningkatan desain responsif
- Perbaikan aksesibilitas
- Optimasi performa

### Backend

- Perbaikan performa API
- Pengembangan fitur baru
- Peningkatan keamanan
- Optimasi database

### Dokumentasi

- Dokumentasi kode
- Panduan pengguna
- Dokumentasi API
- Pembuatan tutorial

### Testing

- Unit tests
- Integration tests
- End-to-end tests
- Performance testing

## 🌟 Pengakuan

Kontributor akan diakui di README proyek dan catatan rilis. Kontribusi signifikan mungkin akan disorot dalam pengumuman proyek.

## 📞 Pertanyaan?

Jika Anda memiliki pertanyaan tentang kontribusi, jangan ragu untuk:

1. **Buka issue** dengan label "question"
2. **Hubungi maintainer** secara langsung
3. **Periksa dokumentasi dan issue yang ada** terlebih dahulu

## 📄 Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi yang sama dengan proyek (MIT License).

---

Terima kasih telah berkontribusi untuk membuat proyek ini menjadi lebih baik! 🚀
