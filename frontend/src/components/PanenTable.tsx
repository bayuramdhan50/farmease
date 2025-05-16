'use client';

import { useState, useEffect } from 'react';
import { formatDate, formatNumber, localizeDate } from '@/utils/exportHelpers';
import { PanenData } from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';

interface PanenTableProps {
  data: PanenData[];
  onEdit?: (item: PanenData) => void;
  onDelete?: (id?: number) => void;
  showActions?: boolean;
}

export default function PanenTable({ 
  data, 
  onEdit, 
  onDelete, 
  showActions = true 
}: PanenTableProps) {
  const [sortField, setSortField] = useState<keyof PanenData>('tanggal_tanam');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filteredData, setFilteredData] = useState<PanenData[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<number | undefined>(undefined);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { showToast } = useToast();
  
  // Update filtered data when data changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [data, searchTerm]);
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredData(data);
      return;
    }
    
    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(item => 
      item.nama_tanaman.toLowerCase().includes(lowercasedTerm) ||
      new Date(item.tanggal_tanam).toLocaleDateString('id-ID').includes(term) ||
      item.luas_lahan.toString().includes(term) ||
      item.hasil_panen.toString().includes(term)
    );
    
    setFilteredData(filtered);
  };
  
  // Handle sort
  const handleSort = (field: keyof PanenData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'tanggal_tanam') {
      aValue = new Date(a[sortField]).getTime();
      bValue = new Date(b[sortField]).getTime();
    } else if (sortField === 'luas_lahan' || sortField === 'hasil_panen') {
      aValue = parseFloat(String(a[sortField]));
      bValue = parseFloat(String(b[sortField]));
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
  
  // Handle row selection
  const toggleRowSelection = (id?: number) => {
    if (!id) return;
    
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle all rows selection
  const toggleAllRows = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map(item => item.id!).filter(Boolean));
    }
  };
  
  // Handle delete confirmation
  const confirmDelete = (id?: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };
    // Handle delete action
  const handleDelete = () => {
    if (onDelete && itemToDelete) {
      onDelete(itemToDelete);
      // Show toast notification
      showToast('success', 'Data panen berhasil dihapus');
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(undefined);
  };
  
  // Render sort indicator
  const renderSortIcon = (field: keyof PanenData) => {
    if (sortField !== field) {
      return (
        <span className="ml-1 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    
    return (
      <span className="ml-1 text-primary-600">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };
  
  // Calculate productivity
  const calculateProductivity = (luas: number, hasil: number) => {
    if (!luas || luas === 0) return 0;
    return (hasil / luas) * 10000; // Convert to kg/ha
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table header with search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari data panen..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {selectedRows.length > 0 && (
            <button 
              onClick={() => {}} 
              className="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-md border border-primary-200 hover:bg-primary-100"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {selectedRows.length} dipilih
            </button>
          )}
          <div className="text-sm text-gray-500">
            {filteredData.length} dari {data.length} data
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              {showActions && (
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                    onChange={toggleAllRows}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                </th>
              )}
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('nama_tanaman')}
              >
                <div className="flex items-center">
                  Tanaman
                  {renderSortIcon('nama_tanaman')}
                </div>
              </th>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('tanggal_tanam')}
              >
                <div className="flex items-center">
                  Tanggal Tanam
                  {renderSortIcon('tanggal_tanam')}
                </div>
              </th>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('luas_lahan')}
              >
                <div className="flex items-center">
                  Luas Lahan (m²)
                  {renderSortIcon('luas_lahan')}
                </div>
              </th>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('hasil_panen')}
              >
                <div className="flex items-center">
                  Hasil Panen (kg)
                  {renderSortIcon('hasil_panen')}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produktivitas
              </th>
              {showActions && (
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={showActions ? 7 : 5} 
                  className="py-8 px-4 text-center text-gray-500 bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6" />
                    </svg>
                    <p className="text-lg font-medium">Tidak ada data panen</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Tambahkan data panen baru untuk mulai mencatat hasil panen.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 ${selectedRows.includes(item.id!) ? 'bg-primary-50' : ''} ${hoveredRow === item.id ? 'bg-gray-50' : ''}`}
                  onMouseEnter={() => setHoveredRow(item.id!)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {showActions && (
                    <td className="py-3 px-4 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id!)}
                        onChange={() => toggleRowSelection(item.id)}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {item.nama_tanaman}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(item.tanggal_tanam).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {typeof item.luas_lahan === 'number' ? item.luas_lahan.toLocaleString('id-ID') : item.luas_lahan}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">
                    {typeof item.hasil_panen === 'number' ? item.hasil_panen.toLocaleString('id-ID') : item.hasil_panen}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      <span className={`
                        ${calculateProductivity(item.luas_lahan, item.hasil_panen) > 5000 ? 'text-green-600' : 
                         calculateProductivity(item.luas_lahan, item.hasil_panen) > 3000 ? 'text-yellow-600' : 'text-orange-600'}
                        font-medium
                      `}>
                        {calculateProductivity(item.luas_lahan, item.hasil_panen).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                      </span>
                      <span className="ml-1 text-gray-500 text-xs">kg/ha</span>
                    </div>
                  </td>
                  {showActions && (
                    <td className="py-3 px-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          className="group inline-flex items-center justify-center p-1.5 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors"
                          aria-label="Edit data"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="group inline-flex items-center justify-center p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                          aria-label="Hapus data"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{sortedData.length}</span> data
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Hapus Data Panen</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus data panen ini? Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
