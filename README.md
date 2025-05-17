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
3. Jalankan server development:
   ```
   npm run dev
   ```
4. Akses aplikasi di `http://localhost:3000`

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

Aplikasi ini juga bisa dijalankan dengan Docker Compose:

1. Pastikan Docker dan Docker Compose terinstal
2. Jalankan:
   ```
   docker-compose up -d
   ```
3. Akses aplikasi di `http://localhost:3000`

## Fitur SDGs

FarmEase mengintegrasikan dukungan untuk Tujuan Pembangunan Berkelanjutan (SDGs) melalui:

1. **Halaman Khusus SDGs** - Menjelaskan bagaimana aplikasi mendukung SDGs tertentu
2. **Metrik Keberlanjutan** - Menampilkan produktivitas lahan (kg/Ha) untuk membantu optimalisasi penggunaan sumber daya
3. **Tips Pertanian Berkelanjutan** - Memberikan saran praktis untuk praktik pertanian yang lebih berkelanjutan
4. **Komponen SDG** - Badge dan indikator visual yang menunjukkan kontribusi terhadap SDGs

Dengan menggunakan FarmEase, petani tidak hanya mendapat manfaat dari pengelolaan data panen yang lebih baik, tetapi juga berkontribusi pada tujuan keberlanjutan global.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT.