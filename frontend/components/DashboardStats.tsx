'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SDGBadges from './sdgs/SDGBadges';
import { getPanenApiUrl } from '@/utils/api';

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
        const response = await axios.get(getPanenApiUrl());
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideInUp">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-primary hover-lift group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Panen</h3>
              <p className="text-3xl font-bold text-primary-dark mt-2 group-hover:scale-105 transition-transform">{stats.totalPanen}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah pencatatan panen</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-primary-light hover-lift group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Hasil Panen</h3>
              <p className="text-3xl font-bold text-primary-light mt-2 group-hover:scale-105 transition-transform">
                {stats.totalHasil.toLocaleString()} <span className="text-sm font-normal">kg</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah hasil panen</p>
            </div>
            <div className="p-2 bg-primary-light/10 rounded-lg text-primary-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-accent hover-lift group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Lahan</h3>
              <p className="text-3xl font-bold text-accent mt-2 group-hover:scale-105 transition-transform">
                {stats.totalLahan.toLocaleString()} <span className="text-sm font-normal">Ha</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah luas lahan</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-l-4 border-accent-light hover-lift group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Jenis Tanaman</h3>
              <p className="text-3xl font-bold text-accent-light mt-2 group-hover:scale-105 transition-transform">{stats.uniquePlants}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jumlah jenis tanaman</p>
            </div>
            <div className="p-2 bg-accent-light/10 rounded-lg text-accent-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sustainability Metric Card */}
      <div className="mt-6 card bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-sm font-semibold text-primary-dark flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Metrik Keberlanjutan
              </h3>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                SDGs
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center bg-white/80 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Produktivitas Lahan:</p>
                  <p className="text-xl font-bold text-primary-dark">{stats.avgYield.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg/Ha</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-green-300 dark:border-green-700">
                Meningkatkan produktivitas lahan mendukung SDG 2 (Zero Hunger) dan SDG 12 (Responsible Consumption and Production).
                <Link href="/sdgs" className="ml-1 text-primary-dark hover:underline inline-flex items-center">
                  Pelajari lebih lanjut
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
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
