# FarmEase - Aplikasi Pencatatan Hasil Panen

FarmEase adalah aplikasi web fullstack untuk pencatatan dan analisis hasil panen pertanian yang mendukung praktik pertanian berkelanjutan.

## Fitur Utama

- Pencatatan data panen (tanaman, luas lahan, tanggal tanam, dan hasil panen)
- Tampilan data dalam bentuk tabel yang mudah dibaca
- Analisis data panen dengan visualisasi grafik
- Ekspor data ke format Excel dan PDF
- Antarmuka yang responsif dan user-friendly
- Dukungan Tujuan Pembangunan Berkelanjutan (SDGs)

## Dukungan terhadap SDGs

FarmEase mendukung beberapa Tujuan Pembangunan Berkelanjutan (Sustainable Development Goals/SDGs), antara lain:

1. **SDG 2: Zero Hunger** - Dengan memantau dan mengoptimalkan produksi pertanian, FarmEase membantu meningkatkan ketahanan pangan.
   
2. **SDG 12: Responsible Consumption and Production** - Aplikasi ini mendorong efisiensi sumber daya dengan memantau hasil panen per satuan lahan.
   
3. **SDG 13: Climate Action** - Data historis membantu petani mengidentifikasi tren yang mungkin terkait dengan perubahan iklim.
   
4. **SDG 15: Life on Land** - FarmEase mendukung praktik pertanian berkelanjutan yang menjaga ekosistem darat.

## Teknologi

### Backend
- Node.js dengan Express.js
- MySQL database
- MVC (Model-View-Controller) architecture
- RESTful API

### Frontend
- Next.js dengan TypeScript
- Tailwind CSS untuk styling
- Recharts untuk visualisasi data
- XLSX dan jsPDF untuk ekspor data

## Struktur Proyek

```
farmease/
├── backend/                # Express.js API
│   ├── config/             # Konfigurasi database
│   ├── controllers/        # Controllers untuk logika bisnis
│   ├── models/             # Model data
│   ├── routes/             # Definisi API routes
│   └── scripts/            # Script utilitas (seperti inisialisasi database)
├── frontend/               # Next.js frontend
│   ├── app/                # Halaman aplikasi Next.js 13+ (App Router)
│   │   ├── bantuan/        # Halaman bantuan
│   │   ├── laporan/        # Halaman laporan
│   │   ├── panen/          # Halaman pengelolaan data panen
│   │   │   ├── [id]/       # Halaman detail panen
│   │   │   ├── add/        # Halaman tambah panen
│   │   │   └── edit/[id]/  # Halaman edit panen
│   │   ├── sdgs/           # Halaman SDGs
│   │   ├── tentang/        # Halaman tentang aplikasi
│   │   ├── globals.css     # Style global
│   │   ├── layout.tsx      # Layout utama aplikasi
│   │   └── page.tsx        # Halaman utama (dashboard)
│   ├── components/         # Komponen UI reusable
│   │   ├── sdgs/           # Komponen terkait SDGs
│   │   ├── PanenTable.tsx  # Tabel data panen
│   │   ├── PanenForm.tsx   # Form input data panen
│   │   ├── PanenChart.tsx  # Visualisasi data panen
│   │   └── ...             # Komponen lainnya
│   └── public/             # Aset statis (gambar, font, dll)
└── docker-compose.yml      # Konfigurasi Docker Compose
```

## Cara Menjalankan Aplikasi

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- MySQL database

### Langkah-langkah

#### Setup Database
1. Buat database MySQL bernama `farmdb`
2. Sesuaikan konfigurasi di `backend/.env` sesuai dengan kredensial MySQL Anda
3. Inisialisasi database (membuat tabel):
   ```
   cd backend
   node scripts/initDb.js
   ```
4. Masukkan data sampel (opsional):
   ```
   cd backend
   node scripts/insertSampleData.js
   ```
   
   Jika ingin mengosongkan tabel dan memasukkan data sampel baru:
   ```
   cd backend
   node scripts/forceInsertSampleData.js
   ```
   
#### Backend
1. Buka terminal di folder `backend`
2. Install dependensi:
   ```
   npm install
   ```
3. Inisialisasi database:
   ```
   node scripts/initDb.js
   ```
4. Jalankan server:
   ```
   npm start
   ```
5. Server berjalan di `http://localhost:5000`

#### Frontend
1. Buka terminal baru di folder `frontend`
2. Install dependensi:
   ```
   npm install
   ```
3. Pastikan file `.env` telah ada dengan konfigurasi berikut:
   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   
   # Environment mode
   NODE_ENV=development
   ```
4. Jalankan server development:
   ```
   npm run dev
   ```
5. Akses aplikasi di `http://localhost:3000`

## API Endpoints

### GET /api/panen
Mendapatkan semua data panen.

### GET /api/panen/:id
Mendapatkan data panen berdasarkan ID.

### POST /api/panen
Membuat data panen baru.

### PUT /api/panen/:id
Memperbarui data panen yang ada.

### DELETE /api/panen/:id
Menghapus data panen berdasarkan ID.

## Docker Deployment

Aplikasi ini bisa dijalankan dengan Docker Compose dengan cepat dan mudah:

1. Pastikan Docker dan Docker Compose terinstal di komputer Anda
2. Buka terminal dan arahkan ke direktori root proyek (yang berisi file docker-compose.yml)
3. Jalankan perintah:
   ```
   docker-compose up -d
   ```
4. Tunggu hingga semua container berjalan (biasanya memerlukan waktu sekitar 1-2 menit)
5. Akses aplikasi:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/panen

Database dan data sampel akan otomatis diinisialisasi saat pertama kali container MySQL berjalan. Data akan disimpan dalam volume Docker sehingga data tidak akan hilang saat container di-restart.

Untuk menghentikan aplikasi, jalankan:
```
docker-compose down
```

Untuk menghapus semua data dan memulai dari awal:
```
docker-compose down -v
docker-compose up -d
```

## Fitur SDGs

FarmEase mengintegrasikan dukungan untuk Tujuan Pembangunan Berkelanjutan (SDGs) melalui:

1. **Halaman Khusus SDGs** - Menjelaskan bagaimana aplikasi mendukung SDGs tertentu
2. **Metrik Keberlanjutan** - Menampilkan produktivitas lahan (kg/Ha) untuk membantu optimalisasi penggunaan sumber daya
3. **Tips Pertanian Berkelanjutan** - Memberikan saran praktis untuk praktik pertanian yang lebih berkelanjutan
4. **Komponen SDG** - Badge dan indikator visual yang menunjukkan kontribusi terhadap SDGs

Dengan menggunakan FarmEase, petani tidak hanya mendapat manfaat dari pengelolaan data panen yang lebih baik, tetapi juga berkontribusi pada tujuan keberlanjutan global.

## PWA Dukungan (Progressive Web App)

FarmEase mendukung fitur Progressive Web App (PWA) yang memungkinkan pengguna untuk menginstal aplikasi di perangkat mereka dan mengaksesnya secara offline. Untuk mengaktifkan fitur PWA, aplikasi memerlukan file-file berikut:

### Icon PWA
Aplikasi memerlukan file icon untuk mendukung PWA:
- `frontend/public/icons/icon-192x192.png` - Icon 192x192 piksel untuk sebagian besar perangkat
- `frontend/public/icons/icon-512x512.png` - Icon 512x512 piksel untuk perangkat resolusi tinggi

### Menambahkan Icons
Untuk menambahkan icon PWA:
1. Buat file icon dengan ukuran 192x192 dan 512x512 piksel
2. Simpan file icon di direktori `frontend/public/icons/`
3. Pastikan nama file sesuai dengan yang didefinisikan di `manifest.json`

### Manifest.json
File `manifest.json` di `frontend/public/` berisi konfigurasi PWA seperti nama aplikasi, icon, dan tema warna.

### Fitur Enkripsi Data

FarmEase mengimplementasikan enkripsi data untuk melindungi informasi sensitif pengguna:

- Enkripsi menggunakan algoritma AES-256
- Field yang dienkripsi meliputi:
  - Nama tanaman
  - Catatan panen
  - Lokasi lahan
- Aplikasi menampilkan indikator enkripsi di halaman yang menampilkan data terenkripsi

### Cara Kerja Enkripsi:
1. Data dienkripsi di backend sebelum disimpan ke database
2. Proses enkripsi menggunakan kunci enkripsi yang disimpan secara aman
3. Data didekripsi saat diambil dari database
4. Frontend menampilkan indikator untuk memberitahu pengguna bahwa data dienkripsi

### Keamanan Tambahan:
- Kunci enkripsi disimpan di file `.env` yang tidak dimasukkan ke dalam repositori
- Gunakan environment variable untuk menyimpan kunci enkripsi di production

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT.