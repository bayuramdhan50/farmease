'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SDGBadges from './sdgs/SDGBadges';

interface DashboardStats {
  totalPanen: number;
  totalHasil: number;
  totalLahan: number;
  uniquePlants: number;
  avgYield: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPanen: 0,
    totalHasil: 0,
    totalLahan: 0,
    uniquePlants: 0,
    avgYield: 0
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
          
          // Calculate average yield per hectare (kg/ha)
          const avgYield = totalLahan > 0 ? totalHasil / totalLahan : 0;
          
          setStats({
            totalPanen,
            totalHasil,
            totalLahan,
            uniquePlants,
            avgYield
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
    <>
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
      
      {/* Sustainability Metric Card */}
      <div className="mt-4 card bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-sm font-semibold text-primary-dark">Metrik Keberlanjutan</h3>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                SDGs
              </span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <p className="text-sm font-medium">Produktivitas Lahan:</p>
                  <p className="text-xl font-bold text-primary-dark">{stats.avgYield.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg/Ha</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Meningkatkan produktivitas lahan mendukung SDG 2 (Zero Hunger) dan SDG 12 (Responsible Consumption and Production).
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <SDGBadges size="sm" />
          </div>
        </div>
      </div>
    </>
  );
}
