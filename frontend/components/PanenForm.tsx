'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getPanenApiUrl } from '@/utils/api';
import EncryptionIndicator from './EncryptionIndicator';

interface PanenFormProps {
  onSuccess?: () => void;
}

export default function PanenForm({ onSuccess }: PanenFormProps) {
  const [formData, setFormData] = useState({
    nama_tanaman: '',
    luas_lahan: '',
    tanggal_tanam: '',
    hasil_panen: '',
    catatan: '',
    lokasi: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.nama_tanaman.trim()) {
      setError('Nama tanaman tidak boleh kosong');
      setLoading(false);
      return;
    }

    if (!formData.luas_lahan || parseFloat(formData.luas_lahan) <= 0) {
      setError('Luas lahan harus lebih dari 0');
      setLoading(false);
      return;
    }

    if (!formData.tanggal_tanam) {
      setError('Tanggal tanam tidak boleh kosong');
      setLoading(false);
      return;
    }

    if (!formData.hasil_panen || parseFloat(formData.hasil_panen) <= 0) {
      setError('Hasil panen harus lebih dari 0');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        nama_tanaman: formData.nama_tanaman,
        luas_lahan: parseFloat(formData.luas_lahan),
        tanggal_tanam: formData.tanggal_tanam,
        hasil_panen: parseFloat(formData.hasil_panen),
        catatan: formData.catatan,
        lokasi: formData.lokasi
      };

      await axios.post(getPanenApiUrl(), payload);
      
      setSuccess('Data panen berhasil ditambahkan!');
      // Reset form
      setFormData({
        nama_tanaman: '',
        luas_lahan: '',
        tanggal_tanam: '',
        hasil_panen: '',
        catatan: '',
        lokasi: ''
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center mr-3 shadow-md transform transition-transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Data Panen</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Masukkan informasi panen baru</p>
          </div>
        </div>
        <EncryptionIndicator />
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex items-start animate-fadeIn shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Terjadi kesalahan</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 flex items-start animate-fadeIn shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Berhasil</h3>
            <p>{success}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="nama_tanaman" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.215 3.468s2.94 3.033 1.209 7.93c1.96.968 3.76 2.49 3.76 5.573 0 3.154-3.58 5.01-7.218 5.01-3.639 0-7.218-1.856-7.218-5.01 0-3.082 1.8-4.604 3.76-5.573-1.73-4.897 1.21-7.93 1.21-7.93s.385 1.948 2.248 3.176c1.864-1.228 2.25-3.176 2.25-3.176z" />
                </svg>
              </span>
              Nama Tanaman <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.215 3.468s2.94 3.033 1.209 7.93c1.96.968 3.76 2.49 3.76 5.573 0 3.154-3.58 5.01-7.218 5.01-3.639 0-7.218-1.856-7.218-5.01 0-3.082 1.8-4.604 3.76-5.573-1.73-4.897 1.21-7.93 1.21-7.93s.385 1.948 2.248 3.176c1.864-1.228 2.25-3.176 2.25-3.176z" />
                </svg>
              </div>
              <input
                type="text"
                id="nama_tanaman"
                name="nama_tanaman"
                value={formData.nama_tanaman}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Contoh: Padi, Jagung, Kedelai, dll."
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1.5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Terenkripsi</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="luas_lahan" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </span>
              Luas Lahan (m²) <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <input
                type="number"
                id="luas_lahan"
                name="luas_lahan"
                value={formData.luas_lahan}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Masukkan luas lahan dalam meter persegi"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="tanggal_tanam" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              Tanggal Tanam <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                id="tanggal_tanam"
                name="tanggal_tanam"
                value={formData.tanggal_tanam}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="hasil_panen" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              Hasil Panen (kg) <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <input
                type="number"
                id="hasil_panen"
                name="hasil_panen"
                value={formData.hasil_panen}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Masukkan hasil panen dalam kilogram"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="lokasi" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Lokasi
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="lokasi"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Masukkan lokasi lahan (desa, kecamatan, dll.)"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1.5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Terenkripsi</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 pb-4 border-t border-b border-gray-200 dark:border-gray-700">
          <div className="form-group">
            <label htmlFor="catatan" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="inline-block mr-2 bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 rounded-md p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              Catatan
            </label>
            <div className="relative group">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <textarea
                id="catatan"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 min-h-[120px] focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all duration-200 shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Masukkan catatan tambahan seperti jenis pupuk, metode tanam, kendala, dll. (opsional)"
              ></textarea>
            </div>
            <div className="text-xs text-gray-500 mt-1.5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Terenkripsi</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Kolom dengan tanda <span className="text-red-500 font-bold">*</span> wajib diisi</span>
          </div>
          <div className="flex justify-end space-x-3">
            <Link 
              href="/panen" 
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Batal
            </Link>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm hover:shadow transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simpan Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
