'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function PanenChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPanenData();
  }, []);

  const fetchPanenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/panen');
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
      if (!groupedData[item.nama_tanaman]) {
        groupedData[item.nama_tanaman] = { hasil: 0, luas: 0 };
      }
      
      groupedData[item.nama_tanaman].hasil += item.hasil_panen;
      groupedData[item.nama_tanaman].luas += item.luas_lahan;
    });
    
    // Convert grouped data to array format for Recharts
    return Object.keys(groupedData).map(name => ({
      name,
      hasil: groupedData[name].hasil,
      luas: groupedData[name].luas
    }));
  };

  if (loading) {
    return <div className="text-center py-10">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

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
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#4CAF50" />
              <YAxis yAxisId="right" orientation="right" stroke="#8D6E63" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="hasil" name="Hasil Panen (Kg)" fill="#4CAF50" />
              <Bar yAxisId="right" dataKey="luas" name="Luas Lahan (Ha)" fill="#8D6E63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
