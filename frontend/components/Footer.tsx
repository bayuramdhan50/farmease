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
            <p className="text-gray-500 text-xs mt-1 flex items-center">
              <span className="mr-1">Mendukung</span>
              <Link href="/sdgs" className="text-primary-dark hover:underline flex items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  SDGs
                </span>
              </Link>
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-dark">
              Beranda
            </Link>
            <Link href="/tentang" className="text-gray-600 hover:text-primary-dark">
              Tentang
            </Link>
            <Link href="/sdgs" className="text-gray-600 hover:text-primary-dark">
              SDGs
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
