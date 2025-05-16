'use client';

import React, { useState, useEffect } from 'react';
import { panenApi, PanenData } from '@/utils/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GroupedData, CropAnalysis, groupByDate, formatNumber } from '@/utils/exportHelpers';
import ExportTools from '@/components/export/ExportTools';
import FloatingActionButton from '@/components/FloatingActionButton';
import { ErrorDisplay, LoadingSpinner, EmptyState } from '@/components/ui/StatusComponents';
import { useToast } from '@/contexts/ToastContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';

export default function AnalisisPage() {
  const [panenData, setPanenData] = useState<PanenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [groupedByYear, setGroupedByYear] = useState<GroupedData[]>([]);
  const [groupedByMonth, setGroupedByMonth] = useState<GroupedData[]>([]);
  const [cropAnalysis, setCropAnalysis] = useState<CropAnalysis[]>([]);
  const [timeGrouping, setTimeGrouping] = useState<'year' | 'month' | 'quarter'>('month');
  const [chartView, setChartView] = useState<'time' | 'compare'>('time');
  const [selectedMetric, setSelectedMetric] = useState<'harvest' | 'area' | 'productivity'>('harvest');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });
  const { showToast } = useToast();

  // Colors for charts
  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#2196F3', '#3F51B5', '#9C27B0', '#E91E63'];
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await panenApi.getAllPanen();
        if (response.success && response.data) {
        const data = response.data;
        setPanenData(data);
        setError('');
        
        // Set initial date range if we have data
        if (data.length > 0) {
          // Sort by date
          const sortedDates = [...data].sort((a, b) => 
            new Date(a.tanggal_tanam).getTime() - new Date(b.tanggal_tanam).getTime()
          );
            
            setDateRange({
              start: sortedDates[0].tanggal_tanam,
              end: sortedDates[sortedDates.length - 1].tanggal_tanam
            });
          }
          
          // Group data by year
          const byYear = groupByDate(data, 'year');
          setGroupedByYear(byYear);
          
          // Group data by month
          const byMonth = groupByDate(data, 'month');
          setGroupedByMonth(byMonth);
          
          // Analyze by crop type
          const cropData: Record<string, { totalHarvest: number; count: number; totalArea: number }> = {};
          
          data.forEach(item => {
            if (!cropData[item.nama_tanaman]) {
              cropData[item.nama_tanaman] = { totalHarvest: 0, count: 0, totalArea: 0 };
            }
            
            cropData[item.nama_tanaman].totalHarvest += item.hasil_panen;
            cropData[item.nama_tanaman].totalArea += item.luas_lahan;
            cropData[item.nama_tanaman].count += 1;
          });
            const cropAnalysisData: CropAnalysis[] = Object.keys(cropData).map(crop => ({
            crop,
            totalHarvest: cropData[crop].totalHarvest,
            totalArea: cropData[crop].totalArea,
            avgYield: cropData[crop].totalHarvest / cropData[crop].totalArea,
            productivity: (cropData[crop].totalHarvest / cropData[crop].totalArea) * 10000, // kg/ha
            count: cropData[crop].count
          }));
          
          // Sort by total harvest from highest to lowest
          cropAnalysisData.sort((a, b) => b.totalHarvest - a.totalHarvest);
          setCropAnalysis(cropAnalysisData);

          // Show success toast if there's data
          if (data.length > 0) {
            showToast('success', `Berhasil memuat ${data.length} data panen untuk analisis`);
          }
        } else {
        const errorMsg = response.error || 'Gagal memuat data panen. Silakan coba lagi nanti.';
        setError(errorMsg);
        showToast('error', errorMsg);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Format date label for charts
  const formatDateLabel = (item: GroupedData) => {
    if (timeGrouping === 'month') {
      const [year, month] = item.date.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (timeGrouping === 'quarter') {
      const [year, quarter] = item.date.split('-Q');
      return `Q${quarter} ${year}`;
    }
    return item.date;
  };

  // Handle grouping change
  const handleGroupingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeGrouping(e.target.value as 'year' | 'month' | 'quarter');
  };

  // Handle metric change
  const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetric(e.target.value as 'harvest' | 'area' | 'productivity');
  };

  // Handle chart view change
  const handleChartViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartView(e.target.value as 'time' | 'compare');
  };
  // Handle crop selection
  const handleCropSelection = (crop: string) => {
    setSelectedCrops(prev => {
      if (prev.includes(crop)) {
        const newSelection = prev.filter(c => c !== crop);
        
        // Show toast notification about removed filter
        if (newSelection.length === 0) {
          showToast('info', 'Filter tanaman telah dihapus');
        } else {
          showToast('info', `Filter tanaman ${crop} telah dihapus`);
        }
        
        return newSelection;
      } else {
        // Show toast notification about added filter
        if (prev.length === 0) {
          showToast('info', `Memfilter data untuk tanaman ${crop}`);
        } else {
          showToast('info', `Menambahkan filter tanaman ${crop}`);
        }
        
        return [...prev, crop];
      }
    });
  };
  // Handle date range change
  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    setDateRange(prev => {
      const newRange = { ...prev, [key]: value };
      
      // Only show toast if both start and end dates are set or if removing a filter
      if ((key === 'start' && value && prev.end) || 
          (key === 'end' && value && prev.start)) {
        
        const startDate = new Date(key === 'start' ? value : prev.start);
        const endDate = new Date(key === 'end' ? value : prev.end);
        
        // Format dates for display
        const formattedStart = startDate.toLocaleDateString('id-ID');
        const formattedEnd = endDate.toLocaleDateString('id-ID');
        
        showToast('info', `Memfilter data dari ${formattedStart} hingga ${formattedEnd}`);
      }
      // Show toast when removing a date filter
      else if ((key === 'start' && !value && prev.start) || 
              (key === 'end' && !value && prev.end)) {
        showToast('info', `Filter tanggal ${key === 'start' ? 'awal' : 'akhir'} telah dihapus`);
      }
      
      return newRange;
    });
  };

  // Filter data based on selected filters
  const getFilteredData = () => {
    let filtered = [...panenData];
    
    // Filter by selected crops if any
    if (selectedCrops.length > 0) {
      filtered = filtered.filter(item => selectedCrops.includes(item.nama_tanaman));
    }
    
    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(item => {
        try {
          return new Date(item.tanggal_tanam) >= new Date(dateRange.start);
        } catch (error) {
          console.error('Invalid date format:', item.tanggal_tanam);
          return true; // Include items with invalid dates
        }
      });
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => {
        try {
          return new Date(item.tanggal_tanam) <= new Date(dateRange.end);
        } catch (error) {
          console.error('Invalid date format:', item.tanggal_tanam);
          return true; // Include items with invalid dates
        }
      });
    }
    
    return filtered;
  };
  // Get current grouped data based on selected grouping
  const getCurrentGroupedData = () => {
    const filteredData = getFilteredData();
    if (timeGrouping === 'year') return groupByDate(filteredData, 'year');
    if (timeGrouping === 'quarter') return groupByDate(filteredData, 'quarter');
    return groupByDate(filteredData, 'month');
  };  // Generate comparison data for crops over time
  const getComparisonData = () => {
    const timeData = getCurrentGroupedData();
    const filteredData = getFilteredData();
    
    // Either use selected crops or top 5 crops if none selected
    let cropNames: string[];
    if (selectedCrops.length > 0) {
      cropNames = selectedCrops;
    } else {
      cropNames = cropAnalysis.map(item => item.crop).slice(0, 5); // Top 5 crops
    }
    
    return timeData.map(period => {
      const result: any = { date: period.date, formattedDate: formatDateLabel(period) };
      
      // For each time period, find the data for each crop
      cropNames.forEach(crop => {
        // Filter all panenData for this time period and this crop
        const dateParts = period.date.split('-');
        const isPeriodMatch = (itemDate: string) => {
          const itemDateObj = new Date(itemDate);
          if (timeGrouping === 'year') {
            return itemDateObj.getFullYear().toString() === period.date;
          } else if (timeGrouping === 'month') {
            return (
              itemDateObj.getFullYear().toString() === dateParts[0] && 
              (itemDateObj.getMonth() + 1).toString().padStart(2, '0') === dateParts[1]
            );
          } else if (timeGrouping === 'quarter') {
            const [year, quarter] = period.date.split('-Q');
            const itemQuarter = Math.floor(itemDateObj.getMonth() / 3) + 1;
            return itemDateObj.getFullYear().toString() === year && itemQuarter.toString() === quarter;
          }
          return false;
        };

        const cropData = filteredData.filter(item => 
          item.nama_tanaman === crop && isPeriodMatch(item.tanggal_tanam)
        );

        if (selectedMetric === 'harvest') {
          result[crop] = cropData.reduce((sum: number, item: PanenData) => sum + item.hasil_panen, 0);
        } else if (selectedMetric === 'area') {
          result[crop] = cropData.reduce((sum: number, item: PanenData) => sum + item.luas_lahan, 0);
        } else {
          const totalHarvest = cropData.reduce((sum: number, item: PanenData) => sum + item.hasil_panen, 0);
          const totalArea = cropData.reduce((sum: number, item: PanenData) => sum + item.luas_lahan, 0);
          result[crop] = totalArea > 0 ? (totalHarvest / totalArea) * 10000 : 0; // kg/ha
        }
      });
      
      return result;
    });
  };

  // Get chart title and y-axis label based on selected metric
  const getChartLabels = () => {
    if (selectedMetric === 'harvest') {
      return { title: 'Tren Hasil Panen', yLabel: 'Hasil Panen (kg)' };
    } else if (selectedMetric === 'area') {
      return { title: 'Tren Luas Lahan', yLabel: 'Luas Lahan (m²)' };
    } else {
      return { title: 'Tren Produktivitas', yLabel: 'Produktivitas (kg/ha)' };
    }
  };

  // Get tooltip formatter based on selected metric
  const getTooltipFormatter = (value: number) => {
    if (selectedMetric === 'harvest') {
      return [`${formatNumber(value)} kg`, 'Hasil Panen'];
    } else if (selectedMetric === 'area') {
      return [`${formatNumber(value)} m²`, 'Luas Lahan'];
    } else {
      return [`${formatNumber(value)} kg/ha`, 'Produktivitas'];
    }
  };

  // Get bar chart dataKey
  const getBarChartDataKey = () => {
    if (selectedMetric === 'harvest') return 'totalHarvest';
    if (selectedMetric === 'area') return 'totalArea';
    return 'productivity';
  };

  // Get bar chart formatter
  const getBarChartFormatter = (value: number) => {
    if (selectedMetric === 'harvest') return `${formatNumber(value)} kg`;
    if (selectedMetric === 'area') return `${formatNumber(value)} m²`;
    return `${formatNumber(value)} kg/ha`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">Analisis Hasil Panen</h1>
          <p className="text-gray-600">Visualisasi dan analisis data panen pertanian</p>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <h2 className="text-xl font-semibold text-primary-700 flex items-center mb-4 lg:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Data
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setSelectedCrops([])} 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Reset Filter
              </button>
              <ExportTools 
                data={getFilteredData()} 
                fileName="data_panen_filtered" 
                title="Data Panen FarmEase (Filtered)" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Tanggal</label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Crop Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Tanaman</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {cropAnalysis.slice(0, 5).map((crop, index) => (
                  <button
                    key={crop.crop}
                    onClick={() => handleCropSelection(crop.crop)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      selectedCrops.includes(crop.crop) 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: selectedCrops.includes(crop.crop) ? 'white' : COLORS[index % COLORS.length] }}
                    ></div>
                    {crop.crop}
                  </button>
                ))}
                {cropAnalysis.length > 5 && (
                  <details className="relative">
                    <summary className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer list-none">
                      +{cropAnalysis.length - 5} lainnya
                    </summary>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2 border border-gray-200">
                      {cropAnalysis.slice(5).map((crop, index) => (
                        <button
                          key={crop.crop}
                          onClick={() => handleCropSelection(crop.crop)}
                          className={`w-full text-left px-3 py-2 text-sm rounded ${
                            selectedCrops.includes(crop.crop) 
                              ? 'bg-primary-600 text-white' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {crop.crop}
                        </button>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
            
            {/* Active Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter Aktif</label>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {selectedCrops.length === 0 && !dateRange.start && !dateRange.end && (
                    <span className="text-sm text-gray-500">Tidak ada filter aktif</span>
                  )}
                  
                  {dateRange.start && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Dari: {new Date(dateRange.start).toLocaleDateString('id-ID')}
                      <button 
                        onClick={() => handleDateRangeChange('start', '')}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {dateRange.end && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Sampai: {new Date(dateRange.end).toLocaleDateString('id-ID')}
                      <button 
                        onClick={() => handleDateRangeChange('end', '')}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {selectedCrops.map(crop => (
                    <span key={crop} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {crop}
                      <button 
                        onClick={() => handleCropSelection(crop)}
                        className="ml-1 text-primary-500 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
          {loading ? (
          <LoadingSpinner text="Memuat data analisis..." />
        ) : error ? (
          <ErrorDisplay errorMsg={error} />
        ) : getFilteredData().length === 0 ? (
          <EmptyState 
            title="Tidak ada data yang sesuai filter" 
            message="Tidak ada data yang cocok dengan filter yang dipilih. Coba ubah filter atau reset filter untuk melihat semua data."
            actionLabel="Reset Filter"
            onAction={() => {
              setSelectedCrops([]);
              setDateRange({start: '', end: ''});
              showToast('info', 'Filter telah direset');
            }} 
          />
        ) : (
          <>
            {/* Summary Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(() => {
                const filteredData = getFilteredData();
                const totalHarvest = filteredData.reduce((sum, item) => sum + item.hasil_panen, 0);
                const totalArea = filteredData.reduce((sum, item) => sum + item.luas_lahan, 0);
                const avgProductivity = totalArea > 0 ? (totalHarvest / totalArea) * 10000 : 0;
                const uniqueCrops = [...new Set(filteredData.map(item => item.nama_tanaman))].length;
                
                return (
                  <>
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-primary-500 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 uppercase">Total Hasil Panen</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{formatNumber(totalHarvest)} kg</p>
                        </div>
                        <span className="bg-primary-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          {selectedCrops.length > 0 ? `${selectedCrops.length} jenis tanaman terpilih` : 'Semua jenis tanaman'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 uppercase">Total Luas Lahan</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            {formatNumber(totalArea)} m²
                            <span className="text-sm font-normal text-gray-500 ml-1">
                              ({(totalArea / 10000).toFixed(2)} ha)
                            </span>
                          </p>
                        </div>
                        <span className="bg-green-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          {filteredData.length} catatan panen
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 uppercase">Produktivitas</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{formatNumber(avgProductivity)} kg/ha</p>
                        </div>
                        <span className="bg-amber-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className={`text-sm ${
                          avgProductivity > 5000 ? 'text-green-600' : 
                          avgProductivity > 3000 ? 'text-amber-600' : 
                          'text-red-600'
                        }`}>
                          {avgProductivity > 5000 ? 'Produktivitas tinggi' : 
                           avgProductivity > 3000 ? 'Produktivitas sedang' : 
                           'Produktivitas rendah'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 uppercase">Jenis Tanaman</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{uniqueCrops}</p>
                        </div>
                        <span className="bg-indigo-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          {dateRange.start && dateRange.end ? 
                            `${new Date(dateRange.start).toLocaleDateString('id-ID')} - ${new Date(dateRange.end).toLocaleDateString('id-ID')}` : 
                            'Semua periode'}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
                  
            {/* Chart Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4 md:mb-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {getChartLabels().title}
                  {(selectedCrops.length > 0 || dateRange.start || dateRange.end) && (
                    <span className="ml-2 text-sm font-normal text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      Data Terfilter
                    </span>
                  )}
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div>
                    <select
                      value={chartView}
                      onChange={handleChartViewChange}
                      className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="time">Tren Waktu</option>
                      <option value="compare">Perbandingan Tanaman</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={timeGrouping}
                      onChange={handleGroupingChange}
                      className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="month">Bulanan</option>
                      <option value="quarter">Kuartalan</option>
                      <option value="year">Tahunan</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={selectedMetric}
                      onChange={handleMetricChange}
                      className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    >
                      <option value="harvest">Hasil Panen</option>
                      <option value="area">Luas Lahan</option>
                      <option value="productivity">Produktivitas</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                {getFilteredData().length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-center">Tidak ada data untuk ditampilkan dengan filter yang dipilih.</p>
                    <button 
                      onClick={() => {
                        setSelectedCrops([]);
                        setDateRange({start: '', end: ''});
                      }}
                      className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === 'time' ? (
                      <AreaChart
                        data={getCurrentGroupedData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDateLabel}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => getTooltipFormatter(value)}
                          labelFormatter={(label) => `Periode: ${formatDateLabel({date: label} as GroupedData)}`}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey={selectedMetric === 'harvest' ? 'totalHarvest' : 
                                  selectedMetric === 'area' ? 'totalLand' : 'productivity'} 
                          name={getChartLabels().yLabel} 
                          stroke="#4CAF50" 
                          fillOpacity={1}
                          fill="url(#colorMetric)"
                          activeDot={{ r: 8 }} 
                        />
                      </AreaChart>
                    ) : (
                      <LineChart
                        data={getComparisonData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="formattedDate" 
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => getTooltipFormatter(value)}
                        />
                        <Legend />
                        {cropAnalysis.slice(0, 5).map((crop, index) => (
                          <Line 
                            key={crop.crop}
                            type="monotone" 
                            dataKey={crop.crop} 
                            name={crop.crop} 
                            stroke={COLORS[index % COLORS.length]} 
                            activeDot={{ r: 8 }} 
                          />
                        ))}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Yield Analysis by Crop Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Distribusi Hasil Panen per Tanaman
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cropAnalysis}
                        dataKey="totalHarvest"
                        nameKey="crop"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ crop, percent }) => `${crop}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {cropAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${formatNumber(value)} kg`, 'Hasil Panen']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {selectedMetric === 'harvest' ? 'Hasil Panen per Tanaman' : 
                   selectedMetric === 'area' ? 'Luas Lahan per Tanaman' : 
                   'Produktivitas per Tanaman (kg/ha)'}
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cropAnalysis}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="crop" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [getBarChartFormatter(value), selectedMetric === 'harvest' ? 'Hasil Panen' : selectedMetric === 'area' ? 'Luas Lahan' : 'Produktivitas']} />
                      <Legend />
                      <Bar 
                        dataKey={getBarChartDataKey()} 
                        name={getChartLabels().yLabel} 
                        fill="#8BC34A" 
                      >
                        {cropAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Detailed Analysis Table */}            
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                  Analisis Detail per Tanaman
                </h2>
                
                <ExportTools 
                  data={cropAnalysis} 
                  fileName="analisis_tanaman" 
                  title="Analisis Tanaman FarmEase" 
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Tanaman</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Catatan</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Luas Lahan (m²)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hasil Panen (kg)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produktivitas</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                    </tr>
                  </thead>                  <tbody className="divide-y divide-gray-200">
                    {cropAnalysis.map((item, index) => {
                      const filteredData = getFilteredData();
                      const totalHarvest = filteredData.reduce((sum, p) => sum + p.hasil_panen, 0);
                      const percentage = (item.totalHarvest / totalHarvest) * 100;
                      
                      // Skip crops that aren't in the filtered data if filters are applied
                      if (selectedCrops.length > 0 && !selectedCrops.includes(item.crop)) {
                        return null;
                      }
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              {item.crop}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{item.count}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            <div>
                              {formatNumber(item.totalArea)}
                              <span className="text-xs text-gray-400 ml-1">
                                ({(item.totalArea / 10000).toFixed(2)} ha)
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">{formatNumber(item.totalHarvest)}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.avgYield * 10000 > 5000 ? 'bg-green-100 text-green-800' : 
                              item.avgYield * 10000 > 3000 ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {formatNumber(item.avgYield * 10000)} kg/ha
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="mr-2">{percentage.toFixed(1)}%</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2.5">
                                <div className="h-2.5 rounded-full" style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }).filter(Boolean)}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
      <FloatingActionButton />
    </div>
  );
}
