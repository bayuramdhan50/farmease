import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-primary-dark font-bold text-lg">FarmEase</span>
            <p className="text-gray-600 text-sm mt-1">
              © {new Date().getFullYear()} FarmEase. Aplikasi Pencatatan Hasil Panen.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-dark">
              Beranda
            </Link>
            <Link href="/tentang" className="text-gray-600 hover:text-primary-dark">
              Tentang
            </Link>
            <Link href="/bantuan" className="text-gray-600 hover:text-primary-dark">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
