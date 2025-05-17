import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary-dark mb-8">404</div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Link href="/" className="btn-primary text-center inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
