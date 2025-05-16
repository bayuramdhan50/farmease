'use client';

import React, { useState, useEffect } from 'react';
import { panenApi, PanenData } from '@/utils/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, formatNumber } from '@/utils/exportHelpers';
import ExportTools from '@/components/export/ExportTools';
import FloatingActionButton from '@/components/FloatingActionButton';
import { ErrorDisplay, LoadingSpinner, EmptyState } from '@/components/ui/StatusComponents';
import { useToast } from '@/contexts/ToastContext';

export default function PanenPage() {
  const [panenData, setPanenData] = useState<PanenData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<PanenData>({
    nama_tanaman: '',
    luas_lahan: 0,
    tanggal_tanam: formatDate(new Date().toISOString()),
    hasil_panen: 0
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{key: keyof PanenData, direction: 'asc' | 'desc'}>({
    key: 'tanggal_tanam',
    direction: 'desc'
  });
  const { showToast } = useToast();
  // Fetch panen data
  const fetchData = async () => {
    setLoading(true);
    const response = await panenApi.getAllPanen();
    if (response.success && response.data) {
      setPanenData(response.data);
      setError('');
    } else {
      setError(response.error || 'Gagal memuat data panen. Silakan coba lagi nanti.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['luas_lahan', 'hasil_panen'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let response;
    if (isEditing && currentId) {
      // Update existing record
      response = await panenApi.updatePanen(currentId, formData);
    } else {
      // Create new record
      response = await panenApi.createPanen(formData);
    }
    
    if (response.success) {
      // Reset form and fetch updated data
      resetForm();
      await fetchData();
      
      // Show success toast
      showToast(
        'success', 
        isEditing 
          ? 'Data panen berhasil diperbarui' 
          : 'Data panen baru berhasil ditambahkan'
      );
      setError('');
    } else {
      setError(response.error || 'Gagal menyimpan data. Silakan coba lagi.');
      showToast('error', response.error || 'Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  // Handle edit button click
  const handleEdit = (item: PanenData) => {
    setFormData({
      nama_tanaman: item.nama_tanaman,
      luas_lahan: item.luas_lahan,
      tanggal_tanam: formatDate(item.tanggal_tanam),
      hasil_panen: item.hasil_panen
    });
    setCurrentId(item.id);
    setIsEditing(true);
  };  // Handle delete button click
  const handleDelete = async (id?: number) => {
    if (!id) return;
    
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const response = await panenApi.deletePanen(id);
      
      if (response.success) {
        await fetchData();
        showToast('success', 'Data panen berhasil dihapus');
        setError('');
      } else {
        showToast('error', response.error || 'Gagal menghapus data panen');
        setError(response.error || 'Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      nama_tanaman: '',
      luas_lahan: 0,
      tanggal_tanam: formatDate(new Date().toISOString()),
      hasil_panen: 0
    });
    setIsEditing(false);
    setCurrentId(undefined);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const requestSort = (key: keyof PanenData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  // Get sorted and filtered data
  const getSortedAndFilteredData = () => {
    const filteredData = panenData.filter(item => 
      item.nama_tanaman.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.tanggal_tanam).toLocaleDateString('id-ID').includes(searchTerm)
    );
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key] as string | number;
      const bValue = b[sortConfig.key] as string | number;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Calculate total productivity
  const calculateTotalProductivity = (item: PanenData) => {
    return item.luas_lahan > 0 ? (item.hasil_panen / item.luas_lahan) * 10000 : 0;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">Data Panen</h1>
          <p className="text-gray-600">Kelola data panen pertanian Anda</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-primary-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  {isEditing ? (
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  ) : (
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  )}
                </svg>
                {isEditing ? 'Edit Data Panen' : 'Tambah Data Panen'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nama_tanaman" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Tanaman
                  </label>
                  <input
                    type="text"
                    id="nama_tanaman"
                    name="nama_tanaman"
                    value={formData.nama_tanaman}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="contoh: Padi, Jagung, dll."
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="luas_lahan" className="block text-sm font-medium text-gray-700 mb-1">
                    Luas Lahan (m²)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      id="luas_lahan"
                      name="luas_lahan"
                      value={formData.luas_lahan}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">m²</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{formData.luas_lahan > 0 ? `${(formData.luas_lahan / 10000).toFixed(4)} hektar` : ''}</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="tanggal_tanam" className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Tanam
                  </label>
                  <input
                    type="date"
                    id="tanggal_tanam"
                    name="tanggal_tanam"
                    value={formData.tanggal_tanam}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="hasil_panen" className="block text-sm font-medium text-gray-700 mb-1">
                    Hasil Panen (kg)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="number"
                      id="hasil_panen"
                      name="hasil_panen"
                      value={formData.hasil_panen}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                {formData.luas_lahan > 0 && formData.hasil_panen > 0 && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Produktivitas</h3>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-primary-700">
                        {formatNumber((formData.hasil_panen / formData.luas_lahan) * 10000)} kg/ha
                      </span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        (formData.hasil_panen / formData.luas_lahan) * 10000 > 5000 ? 'bg-green-100 text-green-800' :
                        (formData.hasil_panen / formData.luas_lahan) * 10000 > 3000 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(formData.hasil_panen / formData.luas_lahan) * 10000 > 5000 ? 'Tinggi' :
                         (formData.hasil_panen / formData.luas_lahan) * 10000 > 3000 ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      {isEditing ? (
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      ) : (
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      )}
                    </svg>
                    {isEditing ? 'Perbarui Data' : 'Simpan Data'}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4 md:mb-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Daftar Data Panen
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari data..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <ExportTools 
                    data={panenData} 
                    fileName="data_panen" 
                    title="Data Panen FarmEase" 
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600">{error}</p>
                  </div>
                  <button 
                    onClick={fetchData} 
                    className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Coba lagi
                  </button>
                </div>
              ) : getSortedAndFilteredData().length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {searchTerm ? (
                    <p className="text-gray-500">Tidak ada data yang cocok dengan pencarian "{searchTerm}"</p>
                  ) : (
                    <p className="text-gray-500">Belum ada data panen. Silakan tambahkan data baru.</p>
                  )}
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="mt-3 text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Hapus pencarian
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th 
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('nama_tanaman')}
                          >
                            <div className="flex items-center">
                              Tanaman
                              {sortConfig.key === 'nama_tanaman' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  {sortConfig.direction === 'asc' ? (
                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  ) : (
                                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  )}
                                </svg>
                              )}
                            </div>
                          </th>
                          <th 
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('tanggal_tanam')}
                          >
                            <div className="flex items-center">
                              Tanggal Tanam
                              {sortConfig.key === 'tanggal_tanam' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  {sortConfig.direction === 'asc' ? (
                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  ) : (
                                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  )}
                                </svg>
                              )}
                            </div>
                          </th>
                          <th 
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('luas_lahan')}
                          >
                            <div className="flex items-center">
                              Luas Lahan (m²)
                              {sortConfig.key === 'luas_lahan' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  {sortConfig.direction === 'asc' ? (
                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  ) : (
                                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  )}
                                </svg>
                              )}
                            </div>
                          </th>
                          <th 
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort('hasil_panen')}
                          >
                            <div className="flex items-center">
                              Hasil Panen (kg)
                              {sortConfig.key === 'hasil_panen' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  {sortConfig.direction === 'asc' ? (
                                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  ) : (
                                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  )}
                                </svg>
                              )}
                            </div>
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produktivitas
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getSortedAndFilteredData().map((item) => {
                          const productivity = calculateTotalProductivity(item);
                          return (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                                  <div className="text-sm font-medium text-gray-900">{item.nama_tanaman}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.tanggal_tanam).toLocaleDateString('id-ID')}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  {item.luas_lahan.toLocaleString('id-ID')}
                                  <span className="text-xs text-gray-400 ml-1">
                                    ({(item.luas_lahan / 10000).toFixed(4)} ha)
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                                {item.hasil_panen.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  productivity > 5000 ? 'bg-green-100 text-green-800' : 
                                  productivity > 3000 ? 'bg-amber-100 text-amber-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {formatNumber(productivity)} kg/ha
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                    title="Edit data"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 hover:text-red-900 flex items-center"
                                    title="Hapus data"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Menampilkan {getSortedAndFilteredData().length} dari {panenData.length} data
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <FloatingActionButton />
    </div>
  );
}
