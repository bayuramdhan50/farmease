import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Tentang FarmEase
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Aplikasi pencatatan hasil panen yang mudah digunakan untuk petani
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Tentang Aplikasi</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            FarmEase adalah aplikasi yang dirancang untuk membantu petani mencatat dan menganalisis hasil panen mereka. 
            Dengan FarmEase, petani dapat dengan mudah melihat tren produktivitas, membandingkan hasil panen antar musim, 
            dan membuat keputusan berbasis data untuk meningkatkan hasil pertanian.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Aplikasi ini dikembangkan dengan teknologi modern menggunakan Next.js, React, dan Node.js, 
            menjadikannya cepat, responsif, dan mudah digunakan.
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-primary-dark mb-4">Fitur Utama</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Pencatatan hasil panen yang mudah dan terstruktur</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Visualisasi data dalam bentuk grafik dan diagram</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ekspor data ke Excel dan PDF untuk dokumentasi</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Analisis tren produktivitas berdasarkan jenis tanaman</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Antarmuka yang responsif dan mudah digunakan</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Mulai Gunakan FarmEase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-primary-dark mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Catat Data Panen</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Catat hasil panen dengan informasi lengkap tentang tanaman, luas lahan, dan hasil.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-primary-dark mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Analisis Data</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Visualisasi grafik membantu Anda memahami tren hasil panen dari waktu ke waktu.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
            <div className="text-primary-dark mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Ekspor Laporan</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Ekspor data panen Anda ke format Excel atau PDF untuk dokumentasi.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/panen/add" className="btn-primary">
            Mulai Tambahkan Data Panen
          </Link>
        </div>
      </div>
    </div>
  );
}
