'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
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

interface ChartData {
  name: string;
  hasil: number;
  luas: number;
}

// Format angka dengan pemisah ribuan
const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === 0) return '0';
  
  // Hilangkan leading zeros dan format dengan pemisah ribuan
  const num = parseInt(value.toString().replace(/^0+/, ''));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Custom formatter untuk tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((entry, index) => {
          // Pastikan nilai ada dan bertipe number
          const value = entry.value !== undefined ? entry.value : 0;
          const isNumber = typeof value === 'number';
          const isKg = entry.name?.includes('Kg') || false;
          
          let formattedValue;
          if (isNumber) {
            formattedValue = isKg 
              ? formatNumber(value) 
              : value.toFixed(1);
          } else {
            formattedValue = String(value);
          }
          
          return (
            <p key={`item-${index}`} style={{ color: entry.color || '#000' }}>
              {entry.name || 'Nilai'}: {formattedValue} {isKg ? 'Kg' : 'Ha'}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function PanenChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPanenData();
  }, []);

  // Format untuk YAxis Kg
  const formatYAxisKg = (value: number): string => {
    if (value === undefined || isNaN(value) || value === 0) return '0';
    
    // Hilangkan leading zeros dan format dengan pemisah ribuan
    const num = parseInt(value.toString().replace(/^0+/, ''));
    return formatNumber(num); // Always use formatNumber for consistency
  };

  // Format untuk YAxis Ha
  const formatYAxisHa = (value: number): string => {
    if (value === undefined || isNaN(value) || value === 0) return '0';
    
    // Hilangkan leading zeros dan format dengan 1 desimal
    const num = parseFloat(value.toString().replace(/^0+/, ''));
    return num.toFixed(1).replace(/\.0$/, ''); // Hapus .0 jika desimal adalah 0
  };

  const fetchPanenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getPanenApiUrl());
      const data: Panen[] = response.data.data;
      
      // Process data for charting
      const processedData = processPanenData(data);
      setChartData(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Gagal mengambil data untuk grafik. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const processPanenData = (data: Panen[]): ChartData[] => {
    // Group data by plant name
    const groupedData: Record<string, { hasil: number; luas: number }> = {};
    
    data.forEach(item => {
      // Validasi data
      const tanaman = item.nama_tanaman || 'Tanaman Lain';
      const hasil = item.hasil_panen || 0;
      const luas = item.luas_lahan || 0;
      
      if (!groupedData[tanaman]) {
        groupedData[tanaman] = { hasil: 0, luas: 0 };
      }
      
      groupedData[tanaman].hasil += hasil;
      groupedData[tanaman].luas += luas;
    });
    
    // Convert grouped data to array format and sort by hasil panen
    return Object.keys(groupedData)
      .map(name => ({
        name,
        hasil: groupedData[name].hasil,
        luas: groupedData[name].luas
      }))
      .sort((a, b) => b.hasil - a.hasil); // Sort descending by hasil panen
  };

  if (loading) {
    return (
      <div className="text-center py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading chart data...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Hitung nilai maksimum untuk skala Y-axis berdasarkan data tertinggi
  const maxHasil = chartData.length > 0 ? Math.max(...chartData.map(item => item.hasil || 0)) : 0;
  const maxLuas = chartData.length > 0 ? Math.max(...chartData.map(item => item.luas || 0)) : 0;
  
  // Tambahkan margin 10% dari nilai tertinggi untuk memberikan ruang di atas bar tertinggi
  const yAxisDomain = [0, Math.ceil(maxHasil * 1.1)];
  const yAxisDomainRight = [0, Math.ceil(maxLuas * 1.1)];
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Grafik Hasil Panen</h2>
      
      {chartData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Belum ada data untuk ditampilkan dalam grafik.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 40, bottom: 65 }}
            >
              <defs>
                <linearGradient id="hasilGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="luasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#9CA3AF' }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#4CAF50"
                tickFormatter={formatYAxisKg}
                domain={yAxisDomain}
                allowDataOverflow={false}
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#9CA3AF' }}
                label={{ 
                  value: 'Hasil Panen (Kg)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { textAnchor: 'middle', fill: '#4B5563' } 
                }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#8D6E63" 
                tickFormatter={formatYAxisHa}
                domain={yAxisDomainRight}
                allowDataOverflow={false}
                label={{ value: 'Ha', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  color: '#4B5563'
                }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="hasil" 
                name="Hasil Panen (Kg)" 
                fill="url(#hasilGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                cursor="pointer"
                onMouseOver={(e: any) => {
                  e.target.style.filter = 'brightness(0.85)';
                  e.target.style.transition = 'filter 0.3s';
                }}
                onMouseOut={(e: any) => {
                  e.target.style.filter = 'none';
                }}
              />
              <Bar 
                yAxisId="right" 
                dataKey="luas" 
                name="Luas Lahan (Ha)" 
                fill="url(#luasGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
                cursor="pointer"
                onMouseOver={(e: any) => {
                  e.target.style.filter = 'brightness(0.85)';
                  e.target.style.transition = 'filter 0.3s';
                }}
                onMouseOut={(e: any) => {
                  e.target.style.filter = 'none';
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
