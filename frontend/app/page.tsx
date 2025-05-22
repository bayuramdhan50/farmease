import Image from "next/image";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import PanenChart from "@/components/PanenChart";
import SDGBadges from "@/components/sdgs/SDGBadges";

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="py-16 mb-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/60 -z-10"></div>
        <div className="absolute -right-20 top-0 w-96 h-96 bg-green-300/20 dark:bg-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-300/30 dark:bg-yellow-500/20 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-blue-300/30 dark:bg-blue-500/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-purple-300/20 dark:bg-purple-500/10 rounded-full animate-float animation-delay-2000"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Hero content */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-3/5 text-center md:text-left mb-10 md:mb-0 md:pr-8 animate-slideInUp">
              <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-300 leading-tight">
                Farm<span className="text-primary">Ease</span>
              </h1>
              <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 mb-4">
                Solusi Digital untuk Pertanian Modern
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                Aplikasi pencatatan hasil panen yang memudahkan petani mengelola dan 
                <span className="relative inline-block">
                  <span className="relative z-10"> menganalisis data panen </span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-green-200/40 dark:bg-green-700/40 -z-0 rounded"></span>
                </span> untuk produktivitas yang lebih baik dan pertanian berkelanjutan.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <Link 
                  href="/panen" 
                  className="px-8 py-3 text-base font-medium rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Lihat Data Panen</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0 opacity-0 group-hover:h-5 group-hover:w-5 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/panen/add" 
                  className="px-8 py-3 text-base font-medium rounded-full bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 border-2 border-green-500 shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Catat Panen Baru</span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center justify-center md:justify-start mt-8 space-x-4 animate-fadeIn animation-delay-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-green-${item * 100} dark:bg-green-${900 - item * 100}`}>
                      <span className="text-xs font-bold text-white">P{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold">1000+</span> petani telah menggunakan FarmEase
                </p>
              </div>
            </div>
            
            <div className="md:w-2/5 relative">
              <div className="relative w-full h-80 md:h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500 animate-slideInRight">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-white dark:bg-gray-700 rounded-lg shadow-inner p-4 transform -rotate-1">
                    <div className="h-6 w-3/4 bg-green-200 dark:bg-green-700 rounded mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-12 bg-green-100 dark:bg-green-800 rounded"></div>
                      <div className="h-12 bg-green-100 dark:bg-green-800 rounded"></div>
                    </div>
                    <div className="h-24 bg-green-300/40 dark:bg-green-700/40 rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500 dark:bg-green-600 rounded-lg shadow-lg transform rotate-12 animate-float">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -left-6 top-1/4 w-16 h-16 bg-yellow-400 dark:bg-yellow-500 rounded-lg shadow-lg transform -rotate-12 animate-float animation-delay-1000">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-3 px-6 rounded-full shadow-lg">
              <SDGBadges size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Statistik Panen
        </h2>
        <DashboardStats />
      </section>
      
      {/* Charts and Navigation Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Grafik Hasil Panen
            </h2>
            <PanenChart />
          </div>
        </div>
        
        <div className="card hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            Navigasi Cepat
          </h2>
          <div className="space-y-4">
            <Link 
              href="/panen" 
              className="block p-4 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-800 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-1"
            >
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-primary-dark text-lg">Data Panen</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Kelola data hasil panen Anda</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/panen/add" 
              className="block p-4 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-800 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-1"
            >
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-primary-dark text-lg">Tambah Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Catat hasil panen baru</p>
                </div>
              </div>
            </Link>
            
            <Link 
              href="/laporan" 
              className="block p-4 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-800 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:translate-x-1"
            >
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-primary-dark text-lg">Laporan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Lihat analisis hasil panen</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* SDGs Section */}
      <section className="mt-12">
        <div className="card bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-green-900 dark:via-gray-800 dark:to-green-900 border border-green-100 dark:border-green-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 dark:bg-green-800/20 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-200/30 dark:bg-green-800/20 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6 md:max-w-2xl">
              <h2 className="text-2xl font-bold text-primary-dark mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mendukung Tujuan Pembangunan Berkelanjutan
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                FarmEase ikut berperan dalam mencapai Tujuan Pembangunan Berkelanjutan (SDGs),
                termasuk <span className="font-semibold text-primary-dark">Zero Hunger (SDG 2)</span>, 
                <span className="font-semibold text-primary-dark"> Responsible Consumption (SDG 12)</span>, 
                <span className="font-semibold text-primary-dark"> Climate Action (SDG 13)</span>,
                dan <span className="font-semibold text-primary-dark">Life on Land (SDG 15)</span>.
              </p>
            </div>
            <Link 
              href="/sdgs" 
              className="btn-primary self-start md:self-center flex items-center whitespace-nowrap py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span>Pelajari Lebih Lanjut</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Fitur Unggulan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card hover-lift hover:border-green-200 transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Pencatatan Mudah</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Catat hasil panen dengan mudah dan cepat. Semua data tersimpan dengan aman dan terenkripsi.
            </p>
          </div>
          
          <div className="card hover-lift hover:border-green-200 transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Analisis Visual</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualisasi data panen dalam bentuk grafik dan statistik untuk membantu pengambilan keputusan.
            </p>
          </div>
          
          <div className="card hover-lift hover:border-green-200 transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Mendukung SDGs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Berkontribusi pada Tujuan Pembangunan Berkelanjutan melalui pertanian yang lebih efisien.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
