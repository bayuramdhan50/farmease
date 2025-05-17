'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalPanen: number;
  totalHasil: number;
  totalLahan: number;
  uniquePlants: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPanen: 0,
    totalHasil: 0,
    totalLahan: 0,
    uniquePlants: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/panen');
        const panenData = response.data.data;
        
        if (panenData.length > 0) {
          // Calculate stats
          const totalPanen = panenData.length;
          const totalHasil = panenData.reduce((sum: number, item: any) => sum + parseFloat(item.hasil_panen), 0);
          const totalLahan = panenData.reduce((sum: number, item: any) => sum + parseFloat(item.luas_lahan), 0);
          
          // Count unique plants
          const uniquePlantNames = new Set(panenData.map((item: any) => item.nama_tanaman));
          const uniquePlants = uniquePlantNames.size;
          
          setStats({
            totalPanen,
            totalHasil,
            totalLahan,
            uniquePlants
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-primary">
        <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Panen</h3>
        <p className="text-2xl font-bold text-primary-dark mt-2">{stats.totalPanen}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah pencatatan panen</p>
      </div>
      
      <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-primary-light">
        <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Hasil Panen</h3>
        <p className="text-2xl font-bold text-primary-light mt-2">{stats.totalHasil.toLocaleString()} kg</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah hasil panen</p>
      </div>
      
      <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-accent">
        <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Lahan</h3>
        <p className="text-2xl font-bold text-accent mt-2">{stats.totalLahan.toLocaleString()} Ha</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah luas lahan</p>
      </div>
      
      <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-accent-light">
        <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Jenis Tanaman</h3>
        <p className="text-2xl font-bold text-accent-light mt-2">{stats.uniquePlants}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah jenis tanaman</p>
      </div>
    </div>
  );
}
