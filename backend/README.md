# FarmEase - Backend API

Aplikasi pencatatan hasil panen petani menggunakan Express.js dan MySQL.

## Teknologi yang Digunakan

- Node.js
- Express.js
- MySQL
- dotenv untuk konfigurasi

## Struktur Project

```
backend/
  ├── config/
  │   └── database.js
  ├── controllers/
  │   └── panenController.js
  ├── models/
  │   └── Panen.js
  ├── routes/
  │   └── panenRoutes.js
  ├── .env
  ├── index.js
  └── package.json
```

## Instalasi

1. Clone repository ini
2. Buat database MySQL dengan nama `farmease_db`
3. Konfigurasi file `.env` sesuai dengan database MySQL Anda
4. Install dependencies:
   ```
   npm install
   ```
5. Jalankan aplikasi:
   ```
   npm run dev
   ```

## Database Configuration

Buat database MySQL dengan nama `farmease_db`, atau sesuaikan nama di file `.env`.

## API Endpoints

### Panen (Hasil Panen)

| Method | Endpoint       | Deskripsi                   |
|--------|---------------|----------------------------|
| GET    | /api/panen     | Mendapatkan semua data panen |
| GET    | /api/panen/:id | Mendapatkan data panen by ID |
| POST   | /api/panen     | Membuat data panen baru     |
| PUT    | /api/panen/:id | Mengupdate data panen by ID |
| DELETE | /api/panen/:id | Menghapus data panen by ID  |

### Format Data

Format data untuk membuat atau mengubah data panen:

```json
{
  "nama_tanaman": "Padi",
  "luas_lahan": 1.5,
  "tanggal_tanam": "2025-01-15",
  "hasil_panen": 500.5
}
```

## Menjalankan API

Development:
```
npm run dev
```

Production:
```
npm start
```

Server akan berjalan pada `http://localhost:5000`
