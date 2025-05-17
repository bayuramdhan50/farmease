'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface PanenFormProps {
  onSuccess?: () => void;
}

export default function PanenForm({ onSuccess }: PanenFormProps) {
  const [formData, setFormData] = useState({
    nama_tanaman: '',
    luas_lahan: '',
    tanggal_tanam: '',
    hasil_panen: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        hasil_panen: parseFloat(formData.hasil_panen)
      };

      await axios.post('http://localhost:5000/api/panen', payload);
      
      setSuccess('Data panen berhasil ditambahkan!');
      // Reset form
      setFormData({
        nama_tanaman: '',
        luas_lahan: '',
        tanggal_tanam: '',
        hasil_panen: ''
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
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tambah Data Panen</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nama_tanaman" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Tanaman
          </label>
          <input
            type="text"
            id="nama_tanaman"
            name="nama_tanaman"
            value={formData.nama_tanaman}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Contoh: Padi, Jagung, Kedelai, dll."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="luas_lahan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Luas Lahan (Ha)
          </label>
          <input
            type="number"
            id="luas_lahan"
            name="luas_lahan"
            value={formData.luas_lahan}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Luas lahan dalam hektar"
            step="0.01"
            min="0.01"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tanggal_tanam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tanggal Tanam
          </label>
          <input
            type="date"
            id="tanggal_tanam"
            name="tanggal_tanam"
            value={formData.tanggal_tanam}
            onChange={handleChange}
            className="input-field w-full"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="hasil_panen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hasil Panen (Kg)
          </label>
          <input
            type="number"
            id="hasil_panen"
            name="hasil_panen"
            value={formData.hasil_panen}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="Hasil panen dalam kilogram"
            step="0.01"
            min="0.01"
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </button>
        
        {/* Sustainability Tips Section */}
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-semibold text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips Pertanian Berkelanjutan
          </h3>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-2">
              Dengan mencatat data panen Anda, Anda berkontribusi pada pertanian yang lebih berkelanjutan. 
              Berikut beberapa tips:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bandingkan hasil panen dari waktu ke waktu untuk mengidentifikasi praktik terbaik</li>
              <li>Gunakan data untuk mengoptimalkan penggunaan lahan dan sumber daya</li>
              <li>Catat faktor lain seperti cuaca dan penggunaan pupuk untuk analisis lebih mendalam</li>
            </ul>
            <div className="mt-2 text-xs text-gray-500">
              <Link href="/sdgs" className="text-primary-dark hover:underline">Pelajari lebih lanjut</Link> tentang bagaimana FarmEase mendukung Tujuan Pembangunan Berkelanjutan (SDGs).
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
