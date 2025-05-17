'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { getPanenApiUrl } from '@/utils/api';

interface Panen {
  id: number;
  nama_tanaman: string;
  luas_lahan: number;
  tanggal_tanam: string;
  hasil_panen: number;
  created_at: string;
  updated_at: string;
}

export default function PanenDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [panenData, setPanenData] = useState<Panen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPanenData = async () => {
      try {
        const response = await axios.get(getPanenApiUrl(params.id));
        setPanenData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching panen data:', err);
        setError('Gagal mengambil data panen. Silakan coba lagi.');
        setLoading(false);
      }
    };
    
    fetchPanenData();
  }, [params.id]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(getPanenApiUrl(params.id));
        router.push('/panen');
      } catch (err) {
        console.error('Error deleting data:', err);
        alert('Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !panenData) {
    return (
      <div className="card">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Data tidak ditemukan'}
        </div>
        <Link href="/panen" className="btn-primary inline-block">
          Kembali ke Data Panen
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/panen" className="text-primary-dark hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Data Panen
        </Link>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Detail Hasil Panen
          </h1>
          
          <div className="flex space-x-2">
            <Link 
              href={`/panen/edit/${panenData.id}`} 
              className="btn-outline text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="text-red-500 border border-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">ID</h3>
            <p className="text-lg font-medium">{panenData.id}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Nama Tanaman</h3>
            <p className="text-lg font-medium">{panenData.nama_tanaman}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Luas Lahan</h3>
            <p className="text-lg font-medium">{panenData.luas_lahan} Ha</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Tanggal Tanam</h3>
            <p className="text-lg font-medium">{formatDate(panenData.tanggal_tanam)}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Hasil Panen</h3>
            <p className="text-lg font-medium">{panenData.hasil_panen} Kg</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Produktivitas</h3>
            <p className="text-lg font-medium">
              {(panenData.hasil_panen / panenData.luas_lahan).toFixed(2)} Kg/Ha
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
          <p>Dibuat pada: {formatDate(panenData.created_at)}</p>
          <p>Terakhir diperbarui: {formatDate(panenData.updated_at)}</p>
        </div>
      </div>
    </div>
  );
}
