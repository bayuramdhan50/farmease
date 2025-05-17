'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface Panen {
  id: number;
  nama_tanaman: string;
  luas_lahan: number;
  tanggal_tanam: string;
  hasil_panen: number;
  created_at: string;
  updated_at: string;
}

interface TimeSeriesData {
  month: string;
  total: number;
}

interface TanamanData {
  name: string;
  value: number;
}

interface TamanYieldData {
  name: string;
  yield: number;
}

export default function LaporanPage() {
  const [panenData, setPanenData] = useState<Panen[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [tanamanData, setTanamanData] = useState<TanamanData[]>([]);
  const [yieldData, setYieldData] = useState<TamanYieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#4CAF50', '#8D6E63', '#FFC107', '#2196F3', '#F44336', '#9C27B0', '#FF9800', '#3F51B5', '#009688'];

  useEffect(() => {
    fetchPanenData();
  }, []);

  const fetchPanenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/panen');
      const data: Panen[] = response.data.data;
      
      setPanenData(data);
      
      // Process data for various charts
      if (data.length > 0) {
        processTimeSeriesData(data);
        processTanamanData(data);
        processYieldData(data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal mengambil data panen. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const processTimeSeriesData = (data: Panen[]) => {
    // Generate last 6 months
    const months = [];
    for (let i = 0; i < 6; i++) {
      const month = subMonths(new Date(), i);
      months.unshift(month);
    }

    // Create time series data
    const timeSeries = months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      
      const filteredData = data.filter((item) => {
        const tanamDate = parseISO(item.tanggal_tanam);
        return tanamDate >= start && tanamDate <= end;
      });
      
      const total = filteredData.reduce((sum, item) => sum + item.hasil_panen, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        total
      };
    });
    
    setTimeSeriesData(timeSeries);
  };

  const processTanamanData = (data: Panen[]) => {
    // Group by plant name
    const groupedData: Record<string, number> = {};
    
    data.forEach((item) => {
      if (!groupedData[item.nama_tanaman]) {
        groupedData[item.nama_tanaman] = 0;
      }
      
      groupedData[item.nama_tanaman] += 1;
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(groupedData).map((name) => ({
      name,
      value: groupedData[name]
    }));
    
    setTanamanData(chartData);
  };

  const processYieldData = (data: Panen[]) => {
    // Group by plant name and sum yield
    const groupedData: Record<string, number> = {};
    
    data.forEach((item) => {
      if (!groupedData[item.nama_tanaman]) {
        groupedData[item.nama_tanaman] = 0;
      }
      
      groupedData[item.nama_tanaman] += item.hasil_panen;
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(groupedData).map((name) => ({
      name,
      yield: groupedData[name]
    }))
    .sort((a, b) => b.yield - a.yield)  // Sort by yield
    .slice(0, 5);  // Get top 5
    
    setYieldData(chartData);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Laporan Hasil Panen</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualisasi data panen membantu Anda memahami tren dan pola produksi panen dari waktu ke waktu.
        </p>
      </div>
      
      {panenData.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-800 dark:text-white">Belum Ada Data</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Tambahkan data panen untuk melihat laporan visualisasi.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hasil Panen 6 Bulan Terakhir</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Hasil Panen']} />
                  <Legend />
                  <Area type="monotone" dataKey="total" name="Hasil Panen (kg)" stroke="#4CAF50" fill="#A5D6A7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Jenis Tanaman</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tanamanData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tanamanData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entri`, 'Jumlah']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Top 5 Hasil Panen</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yieldData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Hasil Panen']} />
                    <Legend />
                    <Bar dataKey="yield" name="Hasil Panen (kg)" fill="#8D6E63">
                      <LabelList dataKey="yield" position="right" formatter={(value: number) => `${value.toLocaleString()} kg`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
