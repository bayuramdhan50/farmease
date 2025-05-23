'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getPanenApiUrl } from '@/utils/api';
import Link from 'next/link';

// Type definition for harvest data
interface Panen {
  id: number;
  nama_tanaman: string;
  luas_lahan: number;
  tanggal_tanam: string;
  hasil_panen: number;
  catatan?: string;
  lokasi?: string;
  created_at: string;
  updated_at: string;
}

export default function PanenTable() {
  const [panenData, setPanenData] = useState<Panen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPanenData();
  }, []);

  const fetchPanenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getPanenApiUrl());
      setPanenData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal mengambil data panen. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const deletePanen = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(getPanenApiUrl(id));
        // Refresh data after deletion
        fetchPanenData();
      } catch (err) {
        console.error('Error deleting data:', err);
        setError('Gagal menghapus data. Silakan coba lagi.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      panenData.map(item => ({
        'ID': item.id,
        'Nama Tanaman': item.nama_tanaman,
        'Luas Lahan (m²)': item.luas_lahan,
        'Tanggal Tanam': formatDate(item.tanggal_tanam),
        'Hasil Panen (Kg)': item.hasil_panen,
        'Lokasi': item.lokasi || '-',
        'Catatan': item.catatan || '-',
        'Dibuat Pada': formatDate(item.created_at),
        'Diperbarui Pada': formatDate(item.updated_at),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Panen');
    XLSX.writeFile(workbook, 'DataPanen.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Data Hasil Panen', 14, 22);
    
    // Add export date
    doc.setFontSize(10);
    doc.text(`Diekspor pada: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
    
    // Create table data
    const tableColumn = ['ID', 'Nama Tanaman', 'Luas (m²)', 'Tgl Tanam', 'Hasil (Kg)', 'Lokasi', 'Catatan'];
    const tableRows = panenData.map(item => [
      item.id,
      item.nama_tanaman,
      item.luas_lahan,
      formatDate(item.tanggal_tanam),
      item.hasil_panen,
      item.lokasi || '-',
      item.catatan || '-',
    ]);

    // @ts-ignore - jspdf-autotable not properly typed
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [46, 125, 50] }, // Primary green color
    });
    
    doc.save('DataPanen.pdf');
  };

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => fetchPanenData()}
          className="btn-primary"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Data Hasil Panen</h2>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={exportToExcel}
            className="btn-outline text-sm flex items-center transition-all duration-300 hover:-translate-y-1"
            title="Ekspor ke Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="btn-outline text-sm flex items-center transition-all duration-300 hover:-translate-y-1"
            title="Ekspor ke PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          <Link 
            href="/panen/add" 
            className="btn-primary text-sm flex items-center transition-all duration-300 hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </Link>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">
                <div className="flex items-center space-x-1">
                  <span>Nama Tanaman</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </th>
              <th className="table-header">Luas Lahan (m²)</th>
              <th className="table-header">Tanggal Tanam</th>
              <th className="table-header">Hasil Panen (Kg)</th>
              <th className="table-header">
                <div className="flex items-center space-x-1">
                  <span>Lokasi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </th>
              <th className="table-header">
                <div className="flex items-center space-x-1">
                  <span>Catatan</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </th>
              <th className="table-header">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {panenData.length > 0 ? (
              panenData.map((panen) => (
                <tr key={panen.id} className="table-row hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200">
                  <td className="table-cell">{panen.id}</td>
                  <td className="table-cell font-medium text-primary-dark">
                    <div className="flex items-center space-x-1">
                      <span>{panen.nama_tanaman}</span>
                    </div>
                  </td>
                  <td className="table-cell">{panen.luas_lahan}</td>
                  <td className="table-cell">{formatDate(panen.tanggal_tanam)}</td>
                  <td className="table-cell font-medium">{panen.hasil_panen}</td>
                  <td className="table-cell">{panen.lokasi || '-'}</td>
                  <td className="table-cell">
                    {panen.catatan 
                      ? panen.catatan.length > 30 
                        ? `${panen.catatan.substring(0, 30)}...` 
                        : panen.catatan 
                      : '-'}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-3">
                      <Link 
                        href={`/panen/${panen.id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors hover:scale-110 transform duration-200"
                        aria-label="Lihat detail"
                        title="Lihat detail"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link 
                        href={`/panen/edit/${panen.id}`}
                        className="text-amber-500 hover:text-amber-700 transition-colors hover:scale-110 transform duration-200"
                        aria-label="Edit data"
                        title="Edit data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors hover:scale-110 transform duration-200"
                        onClick={() => deletePanen(panen.id)}
                        aria-label="Hapus data"
                        title="Hapus data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="table-cell text-center py-8">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 mb-3">Belum ada data panen. Silakan tambahkan data.</p>
                    <Link href="/panen/add" className="btn-primary text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Data Panen
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
