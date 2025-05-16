# FarmEase Frontend

Frontend aplikasi FarmEase menggunakan Next.js dengan TypeScript dan Tailwind CSS.

## Fitur

- Dashboard dengan ringkasan data
- Halaman pengelolaan data panen (CRUD)
- Halaman analisis dengan visualisasi grafik
- Ekspor data ke Excel dan PDF
- Responsive UI untuk desktop dan mobile

## Tech Stack

- Next.js 15.x
- TypeScript
- Tailwind CSS
- Recharts untuk visualisasi data
- XLSX dan jsPDF untuk ekspor data
- Axios untuk komunikasi dengan API

## Struktur Direktori

```
frontend/
├── public/               # Static files (images, icons)
├── src/
│   ├── app/             # Pages
│   │   ├── page.tsx     # Homepage
│   │   ├── panen/       # Halaman data panen
│   │   └── analisis/    # Halaman analisis
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── export/      # Components for data export
│   └── utils/           # Utility functions
│       ├── api.ts       # API communication
│       └── exportHelpers.ts # Data export helpers
├── tailwind.config.js   # Tailwind CSS configuration
└── next.config.ts       # Next.js configuration
```

## Cara Menjalankan

1. Install dependensi:
   ```
   npm install
   ```

2. Jalankan dalam mode development:
   ```
   npm run dev
   ```

3. Buka [http://localhost:3000](http://localhost:3000) di browser

## Build untuk Production

1. Build aplikasi:
   ```
   npm run build
   ```

2. Jalankan versi production:
   ```
   npm start
   ```

## Docker

Aplikasi ini juga dapat dijalankan menggunakan Docker:

```
docker build -t farmease-frontend .
docker run -p 3000:3000 farmease-frontend
```

Atau gunakan docker-compose dari root direktori proyek:

```
docker-compose up
```
