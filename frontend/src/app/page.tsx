'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { panenApi, PanenData } from '@/utils/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatNumber } from '@/utils/exportHelpers';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useToast } from '@/contexts/ToastContext';
import { ErrorDisplay, LoadingSpinner, EmptyState } from '@/components/ui/StatusComponents';

export default function Home() {
  const [panenData, setPanenData] = useState<PanenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [recentPanen, setRecentPanen] = useState<PanenData[]>([]);
  const [stats, setStats] = useState({
    totalHarvest: 0,
    totalLand: 0,
    avgProductivity: 0,
    uniqueCrops: 0
  });
  const { showToast } = useToast();

  // Fetch panen data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await panenApi.getAllPanen();
        
        if (response.success && response.data) {
          setPanenData(response.data);
          setError('');
          
          // Get the 5 most recent entries
          const sortedData = [...response.data].sort((a, b) => 
            new Date(b.tanggal_tanam).getTime() - new Date(a.tanggal_tanam).getTime()
          );
          setRecentPanen(sortedData.slice(0, 5));
          
          // Calculate statistics
          const totalHarvest = response.data.reduce((sum, item) => sum + item.hasil_panen, 0);
          const totalLand = response.data.reduce((sum, item) => sum + item.luas_lahan, 0);
          const avgProductivity = totalLand > 0 ? (totalHarvest / totalLand) * 10000 : 0; // kg/ha
          const uniqueCrops = new Set(response.data.map(item => item.nama_tanaman)).size;
          
          setStats({
            totalHarvest,
            totalLand,
            avgProductivity,
            uniqueCrops
          });
          
          // Show welcome toast on initial load
          showToast('success', 'Selamat datang di Dashboard FarmEase');
        } else {
          const errorMsg = response.error || 'Gagal memuat data. Silakan coba lagi nanti.';
          setError(errorMsg);
          showToast('error', errorMsg);
        }
      } catch (err) {
        console.error('Error fetching panen data:', err);
        const errorMsg = 'Gagal memuat data panen. Silakan coba lagi nanti.';
        setError(errorMsg);
        showToast('error', errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                FarmEase
              </h1>
              <p className="text-primary-100 text-lg mb-6 leading-relaxed">
                Solusi pencatatan dan analisis hasil panen yang mudah dan lengkap untuk meningkatkan produktivitas pertanian Anda.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/panen" 
                  className="px-6 py-3 bg-white text-primary-700 font-medium rounded-lg shadow hover:bg-primary-50 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Tambah Data Panen
                </Link>
                <Link 
                  href="/analisis" 
                  className="px-6 py-3 bg-primary-800 text-white font-medium rounded-lg shadow hover:bg-primary-900 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Lihat Analisis
                </Link>
              </div>
            </div>
            <div className="md:p-8 relative min-h-[200px] md:min-h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-64 h-64 text-primary-100 opacity-30" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="relative z-10 text-center p-4">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-primary-800 mb-2">Data Pertanian</h3>
                  <p className="text-gray-600 mb-2">Membantu petani mencatat dan menganalisis hasil panen</p>
                  {!loading && !error && (
                    <p className="text-lg font-medium text-primary-600">{panenData.length} Catatan Tersimpan</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-500 uppercase">Total Panen</h3>
                    <div className="mt-1">
                      {loading ? (
                        <div className="h-7 w-28 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">{formatNumber(stats.totalHarvest)} kg</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-500 uppercase">Luas Lahan</h3>
                    <div className="mt-1">
                      {loading ? (
                        <div className="h-7 w-28 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{formatNumber(stats.totalLand)} m²</span>
                          <span className="text-xs ml-1 text-gray-500">({(stats.totalLand / 10000).toFixed(2)} ha)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-500 uppercase">Produktivitas</h3>
                    <div className="mt-1">
                      {loading ? (
                        <div className="h-7 w-28 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{formatNumber(stats.avgProductivity)} kg/ha</span>
                          <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${
                            stats.avgProductivity > 5000 ? 'bg-green-100 text-green-800' :
                            stats.avgProductivity > 3000 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stats.avgProductivity > 5000 ? 'Tinggi' :
                            stats.avgProductivity > 3000 ? 'Sedang' : 'Rendah'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm text-gray-500 uppercase">Jenis Tanaman</h3>
                    <div className="mt-1">
                      {loading ? (
                        <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">{stats.uniqueCrops} Jenis</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Harvest Data */}
        {!loading && !error && recentPanen.length > 0 && (
          <section className="mb-10">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Catatan Panen Terbaru
                  </h2>
                  <Link 
                    href="/panen" 
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                  >
                    Lihat semua
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanaman</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Tanam</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Lahan (m²)</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil Panen (kg)</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produktivitas</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentPanen.map((item) => {
                        const productivity = item.luas_lahan > 0 ? (item.hasil_panen / item.luas_lahan) * 10000 : 0;
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                                <div className="text-sm font-medium text-gray-900">{item.nama_tanaman}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.tanggal_tanam).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.luas_lahan.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.hasil_panen.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                productivity > 5000 ? 'bg-green-100 text-green-800' : 
                                productivity > 3000 ? 'bg-amber-100 text-amber-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {formatNumber(productivity)} kg/ha
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Features Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Fitur FarmEase
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pencatatan yang Mudah</h3>
                <p className="text-gray-600 mb-4">
                  Catat data panen dengan cepat dan mudah. Formulir yang intuitif dan sederhana untuk membantu Anda mengelola data pertanian.
                </p>
                <Link href="/panen" className="text-primary-600 hover:text-primary-800 font-medium flex items-center text-sm">
                  Tambah Data
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analisis Grafik</h3>
                <p className="text-gray-600 mb-4">
                  Lihat tren dan pola hasil panen dalam bentuk grafik interaktif. Bandingkan produktivitas antar tanaman dan periode.
                </p>
                <Link href="/analisis" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm">
                  Lihat Analisis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ekspor Data</h3>
                <p className="text-gray-600 mb-4">
                  Ekspor data ke Excel atau PDF untuk kebutuhan pelaporan dan analisis lebih lanjut. Buat laporan secara cepat dan profesional.
                </p>
                <Link href="/panen" className="text-amber-600 hover:text-amber-800 font-medium flex items-center text-sm">
                  Ekspor Data
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section>
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Mulai Catat Hasil Panen Anda Sekarang</h2>
              <p className="text-secondary-100 text-lg mb-6 max-w-3xl mx-auto">
                Buat keputusan yang lebih baik dengan data pertanian yang lengkap. FarmEase membantu Anda mengelola dan menganalisis hasil panen dengan mudah.
              </p>
              <Link 
                href="/panen" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Data Panen
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingActionButton />
    </div>
  );
}
