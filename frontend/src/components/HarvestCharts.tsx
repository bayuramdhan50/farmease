'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart, 
  Area
} from 'recharts';
import { groupByDate, formatNumber } from '@/utils/exportHelpers';
import { PanenData } from '@/utils/api';

// Colors for charts
const COLORS = [
  '#16a34a', '#22c55e', '#4ade80', '#86efac', '#a3e635', '#bef264',
  '#eab308', '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#a855f7'
];

// Pastel version of the same colors
const PASTEL_COLORS = [
  '#86efac', '#bbf7d0', '#dcfce7', '#d9f99d', '#e2e8f0', '#f8fafc',
  '#fef3c7', '#fed7aa', '#fecaca', '#fbcfe8', '#f5d0fe', '#ddd6fe'
];

interface HarvestChartsProps {
  data: PanenData[];
}

type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'stacked';
type GroupByType = 'year' | 'month' | 'quarter';
type DataView = 'harvest' | 'land' | 'productivity';

interface CropData {
  name: string;
  value: number;
  landArea: number;
  count: number;
}

// Add proper types for recharts TooltipProps
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: any;
    color?: string;
    dataKey?: string | number;
  }>;
  label?: string;
}

// Interface for time series data
interface TimeSeriesData {
  date: string;
  dateFormatted: string;
  [key: string]: string | number;
}

export default function HarvestCharts({ data }: HarvestChartsProps) {
  const [groupBy, setGroupBy] = useState<GroupByType>('month');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dataView, setDataView] = useState<DataView>('harvest');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [animateCharts, setAnimateCharts] = useState(true);
  
  // Get unique crops from data
  useEffect(() => {
    if (data.length) {
      const crops = [...new Set(data.map(item => item.nama_tanaman))];
      setAvailableCrops(crops);
      
      // Select all crops by default if none are selected
      if (selectedCrops.length === 0) {
        setSelectedCrops(crops.slice(0, 5)); // Default to top 5 crops
      }
    }
  }, [data]);

  // Disable animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateCharts(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Group data by selected period
  const chartData = groupByDate(data, groupBy);
  
  // Filter data by selected crops
  const filteredData = selectedCrops.length > 0
    ? data.filter(item => selectedCrops.includes(item.nama_tanaman))
    : data;
  
  // Format date for display
  const formatDateLabel = (item: {date: string}) => {
    if (groupBy === 'month') {
      const [year, month] = item.date.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } else if (groupBy === 'quarter') {
      const [year, quarter] = item.date.split('-Q');
      return `Q${quarter} ${year}`;
    }
    return item.date;
  };
  
  // Prepare data for pie chart
  const preparePieData = (): CropData[] => {
    const cropData: Record<string, CropData> = {};
    
    filteredData.forEach(item => {
      if (!cropData[item.nama_tanaman]) {
        cropData[item.nama_tanaman] = {
          name: item.nama_tanaman,
          value: 0,
          landArea: 0,
          count: 0
        };
      }
      
      cropData[item.nama_tanaman].value += item.hasil_panen;
      cropData[item.nama_tanaman].landArea += item.luas_lahan;
      cropData[item.nama_tanaman].count += 1;
    });
    
    return Object.values(cropData).sort((a, b) => b.value - a.value);
  };
  
  // Get pie data based on current data view
  const getPieData = () => {
    const rawData = preparePieData();
    
    if (dataView === 'harvest') {
      return rawData.map(item => ({
        name: item.name,
        value: item.value
      }));
    } else if (dataView === 'land') {
      return rawData.map(item => ({
        name: item.name,
        value: item.landArea
      }));
    } else {
      // Productivity: harvest / land * 10000 (convert to kg/ha)
      return rawData.map(item => ({
        name: item.name,
        value: item.landArea > 0 ? (item.value / item.landArea) * 10000 : 0
      }));
    }
  };
  
  // Prepare data for bar/line charts based on grouping
  const prepareTimeSeriesData = (): TimeSeriesData[] => {
    // Group by time period
    const cropsByTime: Record<string, TimeSeriesData> = {};
    
    filteredData.forEach(item => {
      const date = new Date(item.tanggal_tanam);
      let period: string;
      
      if (groupBy === 'month') {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        period = `${date.getFullYear()}-Q${quarter}`;
      } else {
        period = `${date.getFullYear()}`;
      }
      
      if (!cropsByTime[period]) {
        cropsByTime[period] = {
          date: period,
          dateFormatted: formatDateLabel({ date: period })
        };
      }
        if (!cropsByTime[period][`${item.nama_tanaman}_harvest`]) {
        cropsByTime[period][`${item.nama_tanaman}_harvest`] = 0;
        cropsByTime[period][`${item.nama_tanaman}_land`] = 0;
      }
      
      cropsByTime[period][`${item.nama_tanaman}_harvest`] = (cropsByTime[period][`${item.nama_tanaman}_harvest`] as number) + item.hasil_panen;
      cropsByTime[period][`${item.nama_tanaman}_land`] = (cropsByTime[period][`${item.nama_tanaman}_land`] as number) + item.luas_lahan;
    });
    
    // Sort by date
    return Object.values(cropsByTime).sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  };
  
  // Custom tooltip formatter for charts
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-lg">
          <p className="font-semibold text-gray-700">{label}</p>
          <div className="mt-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center mt-1">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}: </span>
                <span className="text-sm font-semibold ml-1">
                  {formatNumber(entry.value)} 
                  {dataView === 'harvest' ? ' kg' : dataView === 'land' ? ' m²' : ' kg/ha'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Calculate totals for summary
  const calculateSummary = () => {
    if (filteredData.length === 0) return { totalHarvest: 0, totalLand: 0, avgProductivity: 0 };
    
    const totalHarvest = filteredData.reduce((sum, item) => sum + item.hasil_panen, 0);
    const totalLand = filteredData.reduce((sum, item) => sum + item.luas_lahan, 0);
    const avgProductivity = totalLand > 0 ? (totalHarvest / totalLand) * 10000 : 0;
    
    return { totalHarvest, totalLand, avgProductivity };
  };
  
  const summary = calculateSummary();
  
  // Toggle crop selection
  const toggleCropSelection = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };
  
  // Select all crops
  const selectAllCrops = () => {
    setSelectedCrops([...availableCrops]);
  };
  
  // Deselect all crops
  const deselectAllCrops = () => {
    setSelectedCrops([]);
  };
  
  // Get readable title for current view
  const getViewTitle = () => {
    if (dataView === 'harvest') return 'Hasil Panen';
    if (dataView === 'land') return 'Luas Lahan';
    return 'Produktivitas';
  };
  
  // Get unit for current view
  const getViewUnit = () => {
    if (dataView === 'harvest') return 'kg';
    if (dataView === 'land') return 'm²';
    return 'kg/ha';
  };
  
  // Format data for line/bar chart
  const timeSeriesData = prepareTimeSeriesData();
  
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-primary-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Hasil Panen</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {formatNumber(summary.totalHarvest)} kg
              </h3>
            </div>
            <div className="p-2 bg-primary-50 rounded-md">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Dari {filteredData.length} pencatatan
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Luas Lahan</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {formatNumber(summary.totalLand)} m²
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {(summary.totalLand / 10000).toFixed(2)} hektar
              </p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-md">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Rata-rata Produktivitas</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {formatNumber(summary.avgProductivity)} kg/ha
              </h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-md">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          {summary.avgProductivity > 0 && (
            <div className={`text-sm mt-2 ${
              summary.avgProductivity > 5000 ? 'text-green-600' : 
              summary.avgProductivity > 3000 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {summary.avgProductivity > 5000 ? 'Produktivitas Tinggi' : 
               summary.avgProductivity > 3000 ? 'Produktivitas Sedang' : 'Produktivitas Rendah'}
            </div>
          )}
        </div>
      </div>
      
      {/* Chart controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Grafik {getViewTitle()} Tanaman
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 text-sm rounded-l-md ${
                  chartType === 'bar' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 text-sm ${
                  chartType === 'line' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 text-sm ${
                  chartType === 'area' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('stacked')}
                className={`px-3 py-1.5 text-sm ${
                  chartType === 'stacked' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1.5 text-sm rounded-r-md ${
                  chartType === 'pie' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pie
              </button>
            </div>
            
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByType)}
              className="px-3 py-1.5 text-sm bg-gray-100 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={chartType === 'pie'}
            >
              <option value="month">Bulanan</option>
              <option value="quarter">Kuartalan</option>
              <option value="year">Tahunan</option>
            </select>
            
            <select
              value={dataView}
              onChange={(e) => setDataView(e.target.value as DataView)}
              className="px-3 py-1.5 text-sm bg-gray-100 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="harvest">Hasil Panen (kg)</option>
              <option value="land">Luas Lahan (m²)</option>
              <option value="productivity">Produktivitas (kg/ha)</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Crop selection */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Pilih Tanaman</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={selectAllCrops} 
                    className="text-xs text-primary-600 hover:text-primary-800"
                  >
                    Semua
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={deselectAllCrops} 
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {availableCrops.length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada data tanaman</p>
                ) : (
                  availableCrops.map((crop, index) => (
                    <div key={crop} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`crop-${index}`}
                        checked={selectedCrops.includes(crop)}
                        onChange={() => toggleCropSelection(crop)}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <div 
                        className="ml-2 w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <label htmlFor={`crop-${index}`} className="ml-2 text-sm text-gray-700">
                        {crop}
                      </label>
                    </div>
                  ))
                )}
              </div>
              
              {selectedCrops.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {selectedCrops.length} dari {availableCrops.length} tanaman dipilih
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chart */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-md border border-gray-200 p-4">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                  <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-lg font-medium">Tidak ada data untuk ditampilkan</p>
                  <p className="text-sm mt-1">Pilih tanaman untuk melihat grafik</p>
                </div>
              ) : (
                <div className="h-72 md:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={getPieData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          isAnimationActive={animateCharts}
                        >
                          {getPieData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            `${formatNumber(value)} ${getViewUnit()}`, 
                            name
                          ]} 
                        />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          formatter={(value) => <span className="text-xs">{value}</span>}
                        />
                      </PieChart>
                    ) : chartType === 'line' ? (
                      <LineChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="dateFormatted" 
                          tick={{ fontSize: 12 }} 
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => formatNumber(value)}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          formatter={(value) => {
                            const cropName = value.replace('_harvest', '').replace('_land', '').replace('_productivity', '');
                            return <span className="text-xs">{cropName}</span>;
                          }}
                        />                        {selectedCrops.map((crop, index) => {
                          const dataKey = dataView === 'harvest' 
                            ? `${crop}_harvest` 
                            : dataView === 'land' 
                              ? `${crop}_land` 
                              : // For productivity, we need to calculate it
                                (entry: TimeSeriesData) => {
                                  const harvestVal = entry[`${crop}_harvest`] as number;
                                  const landVal = entry[`${crop}_land`] as number;
                                  return (harvestVal && landVal) ? (harvestVal / landVal) * 10000 : 0;
                                };
                          
                          return (
                            <Line
                              key={crop}
                              type="monotone"
                              dataKey={dataKey}
                              name={crop}
                              stroke={COLORS[index % COLORS.length]}
                              activeDot={{ r: 8 }}
                              strokeWidth={2}
                              isAnimationActive={animateCharts}
                            />
                          );
                        })}
                      </LineChart>
                    ) : chartType === 'area' ? (
                      <AreaChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="dateFormatted" 
                          tick={{ fontSize: 12 }} 
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => formatNumber(value)}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          formatter={(value) => {
                            const cropName = value.replace('_harvest', '').replace('_land', '').replace('_productivity', '');
                            return <span className="text-xs">{cropName}</span>;
                          }}
                        />                        {selectedCrops.map((crop, index) => {
                          const dataKey = dataView === 'harvest' 
                            ? `${crop}_harvest` 
                            : dataView === 'land' 
                              ? `${crop}_land` 
                              : // For productivity, we need to calculate it
                                (entry: TimeSeriesData) => {
                                  const harvestVal = entry[`${crop}_harvest`] as number;
                                  const landVal = entry[`${crop}_land`] as number;
                                  return (harvestVal && landVal) ? (harvestVal / landVal) * 10000 : 0;
                                };
                          
                          return (
                            <Area
                              key={crop}
                              type="monotone"
                              dataKey={dataKey}
                              name={crop}
                              stroke={COLORS[index % COLORS.length]}
                              fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                              isAnimationActive={animateCharts}
                            />
                          );
                        })}
                      </AreaChart>
                    ) : chartType === 'stacked' ? (
                      <BarChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        stackOffset="expand"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="dateFormatted" 
                          tick={{ fontSize: 12 }} 
                          tickMargin={10}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          width={80}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string, props: any) => {
                            const cropName = name.replace('_harvest', '').replace('_land', '').replace('_productivity', '');
                            return [`${formatNumber(props.payload[name])} ${getViewUnit()} (${(value * 100).toFixed(1)}%)`, cropName];
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            const cropName = value.replace('_harvest', '').replace('_land', '').replace('_productivity', '');
                            return <span className="text-xs">{cropName}</span>;
                          }}
                        />                        {selectedCrops.map((crop, index) => {
                          const dataKey = dataView === 'harvest' 
                            ? `${crop}_harvest` 
                            : dataView === 'land' 
                              ? `${crop}_land` 
                              : // For productivity, we need to calculate it
                                (entry: TimeSeriesData) => {
                                  const harvestVal = entry[`${crop}_harvest`] as number;
                                  const landVal = entry[`${crop}_land`] as number;
                                  return (harvestVal && landVal) ? (harvestVal / landVal) * 10000 : 0;
                                };
                          
                          return (
                            <Bar
                              key={crop}
                              dataKey={dataKey}
                              name={crop}
                              stackId="a"
                              fill={COLORS[index % COLORS.length]}
                              isAnimationActive={animateCharts}
                            />
                          );
                        })}
                      </BarChart>
                    ) : (
                      <BarChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="dateFormatted" 
                          tick={{ fontSize: 12 }} 
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => formatNumber(value)}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          formatter={(value) => {
                            const cropName = value.replace('_harvest', '').replace('_land', '').replace('_productivity', '');
                            return <span className="text-xs">{cropName}</span>;
                          }}
                        />                        {selectedCrops.map((crop, index) => {
                          const dataKey = dataView === 'harvest' 
                            ? `${crop}_harvest` 
                            : dataView === 'land' 
                              ? `${crop}_land` 
                              : // For productivity, we need to calculate it
                                (entry: TimeSeriesData) => {
                                  const harvestVal = entry[`${crop}_harvest`] as number;
                                  const landVal = entry[`${crop}_land`] as number;
                                  return (harvestVal && landVal) ? (harvestVal / landVal) * 10000 : 0;
                                };
                          
                          return (
                            <Bar
                              key={crop}
                              dataKey={dataKey}
                              name={crop}
                              fill={COLORS[index % COLORS.length]}
                              isAnimationActive={animateCharts}
                              radius={[4, 4, 0, 0]}
                            />
                          );
                        })}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
