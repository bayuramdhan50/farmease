import Image from "next/image";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import PanenChart from "@/components/PanenChart";
import SDGBadges from "@/components/sdgs/SDGBadges";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center py-10 mb-6">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">FarmEase</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Aplikasi pencatatan hasil panen yang memudahkan petani mengelola dan menganalisis data panen mereka.
        </p>
        <div className="flex justify-center mt-4">
          <SDGBadges size="sm" />
        </div>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <PanenChart />
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Navigasi Cepat
          </h2>
          <div className="space-y-4">
            <Link 
              href="/panen" 
              className="block p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="font-medium text-primary-dark">Data Panen</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Kelola data hasil panen Anda</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/panen/add" 
              className="block p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <div>
                  <h3 className="font-medium text-primary-dark">Tambah Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Catat hasil panen baru</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/laporan" 
              className="block p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <h3 className="font-medium text-primary-dark">Laporan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Lihat analisis hasil panen</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* SDGs Section */}
      <div className="card mt-8 bg-green-50 dark:bg-green-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h2 className="text-xl font-semibold text-primary-dark mb-2">
              Mendukung Tujuan Pembangunan Berkelanjutan (SDGs)
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              FarmEase ikut berperan dalam mencapai beberapa Tujuan Pembangunan Berkelanjutan,
              termasuk Zero Hunger (SDG 2), Responsible Consumption (SDG 12), Climate Action (SDG 13),
              dan Life on Land (SDG 15).
            </p>
          </div>
          <Link 
            href="/sdgs" 
            className="btn-primary self-start md:self-center flex items-center whitespace-nowrap"
          >
            <span>Pelajari Lebih Lanjut</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
