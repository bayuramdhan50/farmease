'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getPanenApiUrl } from '@/utils/api';

interface Panen {
  id: number;
  nama_tanaman: string;
  luas_lahan: number;
  tanggal_tanam: string;
  hasil_panen: number;
}

interface EditPanenFormProps {
  panenId: string;
}

export default function EditPanenForm({ panenId }: EditPanenFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_tanaman: '',
    luas_lahan: '',
    tanggal_tanam: '',
    hasil_panen: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    // Fetch existing data
    const fetchPanenData = async () => {
      try {
        const response = await axios.get(getPanenApiUrl(panenId));
        const data = response.data.data;
        
        setFormData({
          nama_tanaman: data.nama_tanaman,
          luas_lahan: data.luas_lahan.toString(),
          tanggal_tanam: formatDateForInput(data.tanggal_tanam),
          hasil_panen: data.hasil_panen.toString()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching panen data:', err);
        setFetchError('Gagal mengambil data panen. Silakan coba lagi.');
        setLoading(false);
      }
    };
    
    fetchPanenData();
  }, [panenId]);

  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (error) {
      return '';
    }
  };

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
    
    // Validation
    if (!formData.nama_tanaman.trim()) {
      setError('Nama tanaman tidak boleh kosong');
      return;
    }

    if (!formData.luas_lahan || parseFloat(formData.luas_lahan) <= 0) {
      setError('Luas lahan harus lebih dari 0');
      return;
    }

    if (!formData.tanggal_tanam) {
      setError('Tanggal tanam tidak boleh kosong');
      return;
    }

    if (!formData.hasil_panen || parseFloat(formData.hasil_panen) <= 0) {
      setError('Hasil panen harus lebih dari 0');
      return;
    }

    try {
      const payload = {
        nama_tanaman: formData.nama_tanaman,
        luas_lahan: parseFloat(formData.luas_lahan),
        tanggal_tanam: formData.tanggal_tanam,
        hasil_panen: parseFloat(formData.hasil_panen)
      };

      await axios.put(getPanenApiUrl(panenId), payload);
      
      setSuccess('Data panen berhasil diperbarui!');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/panen');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="card">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {fetchError}
        </div>
        <button 
          onClick={() => router.push('/panen')}
          className="btn-primary"
        >
          Kembali ke Data Panen
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Edit Data Panen</h2>
      
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
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="btn-primary flex-grow"
          >
            Simpan Perubahan
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/panen')}
            className="btn-outline flex-grow"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
