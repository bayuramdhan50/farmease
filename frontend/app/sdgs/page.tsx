'use client';

import Link from 'next/link';
import Image from 'next/image';

// Interface for SDG items
interface SDGItem {
  number: number;
  title: string;
  description: string;
  color: string;
  relevance: string;
  icon: string;
}

export default function SDGsPage() {
  // SDGs related to FarmEase
  const relevantSDGs: SDGItem[] = [
    {
      number: 2,
      title: "Zero Hunger",
      description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
      color: "bg-yellow-500",
      relevance: "FarmEase membantu petani melacak dan meningkatkan produktivitas panen, berkontribusi pada ketahanan pangan yang lebih baik.",
      icon: "🌾"
    },
    {
      number: 12,
      title: "Responsible Consumption and Production",
      description: "Ensure sustainable consumption and production patterns",
      color: "bg-amber-600",
      relevance: "Dengan melacak hasil panen, FarmEase membantu petani mengidentifikasi area yang dapat meningkatkan efisiensi produksi dan mengurangi pemborosan sumber daya.",
      icon: "♻️"
    },
    {
      number: 13,
      title: "Climate Action",
      description: "Take urgent action to combat climate change and its impacts",
      color: "bg-green-600",
      relevance: "FarmEase membantu petani menganalisis tren hasil panen yang mungkin terpengaruh oleh perubahan iklim dan menyesuaikan praktik pertanian mereka.",
      icon: "🌡️"
    },
    {
      number: 15,
      title: "Life on Land",
      description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
      color: "bg-green-700",
      relevance: "Dengan meningkatkan efisiensi pertanian, FarmEase mendukung praktik pertanian berkelanjutan yang lebih baik untuk ekosistem darat.",
      icon: "🌱"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          FarmEase & Tujuan Pembangunan Berkelanjutan (SDGs)
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Bagaimana aplikasi FarmEase mendukung tujuan pembangunan berkelanjutan global
        </p>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Tentang SDGs</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Tujuan Pembangunan Berkelanjutan (Sustainable Development Goals/SDGs) adalah cetak biru bersama untuk mencapai masa depan yang lebih baik dan berkelanjutan bagi semua. SDGs mengatasi tantangan global yang kita hadapi, termasuk kemiskinan, ketimpangan, perubahan iklim, degradasi lingkungan, perdamaian, dan keadilan.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          FarmEase dirancang dengan mempertimbangkan beberapa tujuan SDGs, terutama yang berkaitan dengan ketahanan pangan, pertanian berkelanjutan, dan tindakan iklim.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary-dark">Kontribusi FarmEase terhadap SDGs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relevantSDGs.map((sdg) => (
            <div key={sdg.number} className="card border-l-4 border-primary-light hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`flex items-center justify-center ${sdg.color} text-white rounded-full w-12 h-12 mr-4 flex-shrink-0`}>
                  <span className="text-2xl">{sdg.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">SDG {sdg.number}: {sdg.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sdg.description}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{sdg.relevance}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-green-50 dark:bg-green-900">
        <h2 className="text-xl font-bold text-primary-dark mb-4">Bagaimana FarmEase Mendukung Pertanian Berkelanjutan</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p><strong>Optimalisasi Produksi</strong> - Dengan melacak hasil panen, petani dapat mengidentifikasi metode tanam yang paling produktif.</p>
          </div>
          
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p><strong>Pengambilan Keputusan Berbasis Data</strong> - Data historis membantu petani membuat keputusan yang lebih baik tentang waktu tanam, jenis tanaman, dan pengelolaan lahan.</p>
          </div>
          
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p><strong>Efisiensi Sumber Daya</strong> - Pemantauan hasil berdasarkan luas lahan membantu mengoptimalkan penggunaan lahan pertanian yang tersedia.</p>
          </div>
          
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p><strong>Adaptasi Perubahan Iklim</strong> - Data jangka panjang membantu petani mengidentifikasi tren yang mungkin terkait dengan perubahan iklim dan menyesuaikan praktik pertanian mereka.</p>
          </div>
        </div>
      </div>

      <div className="text-center my-8">
        <Link 
          href="/tentang" 
          className="btn-primary inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Tentang
        </Link>
      </div>
    </div>
  );
}
