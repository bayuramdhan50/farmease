'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { panenApi, PanenData } from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';

interface PanenFormProps {
  initialData?: PanenData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Predefined tanaman options
const tanamanOptions = [
  'Padi',
  'Jagung',
  'Kedelai',
  'Cabai',
  'Tomat',
  'Bawang Merah',
  'Bawang Putih',
  'Kentang',
  'Singkong',
  'Ubi Jalar'
];

export default function PanenForm({ initialData = null, onSuccess, onCancel }: PanenFormProps) {
  const [formData, setFormData] = useState<{
    nama_tanaman: string;
    luas_lahan: string | number;
    tanggal_tanam: string;
    hasil_panen: string | number;
  }>({
    nama_tanaman: '',
    luas_lahan: '',
    tanggal_tanam: '',
    hasil_panen: ''
  });
    const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const isEditing = !!initialData;
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formStep, setFormStep] = useState<number>(1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for input field
      const formattedDate = initialData.tanggal_tanam 
        ? new Date(initialData.tanggal_tanam).toISOString().split('T')[0]
        : '';
        
      setFormData({
        nama_tanaman: initialData.nama_tanaman || '',
        luas_lahan: initialData.luas_lahan || '',
        tanggal_tanam: formattedDate,
        hasil_panen: initialData.hasil_panen || ''
      });
      
      // If editing, show all fields immediately
      setFormStep(3);
    } else {
      // Default to today's date for new entries
      const today = new Date().toISOString().split('T')[0];
      setFormData(prevData => ({
        ...prevData,
        tanggal_tanam: today
      }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Filter suggestions if tanaman name is being typed
    if (name === 'nama_tanaman' && value) {
      const filtered = tanamanOptions.filter(option => 
        option.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      nama_tanaman: suggestion
    }));
    setShowSuggestions(false);
  };

  const nextStep = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Create payload for API
    const payload: PanenData = {
      nama_tanaman: formData.nama_tanaman,
      luas_lahan: typeof formData.luas_lahan === 'string' ? parseFloat(formData.luas_lahan) : formData.luas_lahan,
      tanggal_tanam: formData.tanggal_tanam,
      hasil_panen: typeof formData.hasil_panen === 'string' ? parseFloat(formData.hasil_panen) : formData.hasil_panen
    };
    
    let response;
    if (isEditing && initialData?.id) {
      // Update existing record
      response = await panenApi.updatePanen(initialData.id, payload);
    } else {
      // Create new record
      response = await panenApi.createPanen(payload);
    }
    
    if (response.success) {
      // Show success toast
      showToast(
        'success', 
        isEditing ? 'Data panen berhasil diperbarui' : 'Data panen baru berhasil ditambahkan'
      );
      
      // Reset form and call success callback
      setFormData({
        nama_tanaman: '',
        luas_lahan: '',
        tanggal_tanam: new Date().toISOString().split('T')[0],
        hasil_panen: ''
      });
      setFormStep(1);
      
      if (onSuccess) onSuccess();
    } else {
      // Show error toast and set error message
      showToast('error', response.error || 'Terjadi kesalahan saat menyimpan data');
      setError(response.error || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    }
    
    setLoading(false);
  };

  const progressPercentage = (formStep / 3) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
        <h2 className="text-xl font-semibold">
          {isEditing ? 'Edit Data Panen' : 'Tambah Data Panen'}
        </h2>
        {!isEditing && (
          <div className="mt-2">
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div 
                className="bg-white h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span>Tanaman</span>
              <span>Lahan</span>
              <span>Hasil</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="m-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200 flex items-center">
          <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        {(formStep === 1 || isEditing) && (
          <div className="mb-4 space-y-4">
            <div>
              <label htmlFor="nama_tanaman" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Tanaman
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nama_tanaman"
                  name="nama_tanaman"
                  value={formData.nama_tanaman}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                  placeholder="Contoh: Padi, Jagung, Kedelai"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {showSuggestions && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-primary-50 text-gray-700"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tanamanOptions.slice(0, 5).map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full hover:bg-primary-100 transition-colors"
                    onClick={() => selectSuggestion(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {!isEditing && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.nama_tanaman}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Selanjutnya
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
        {(formStep === 2 || isEditing) && (
          <div className={`mb-4 space-y-4 ${formStep !== 2 && !isEditing ? 'hidden' : ''}`}>
            <div>
              <label htmlFor="luas_lahan" className="block text-sm font-medium text-gray-700 mb-1">
                Luas Lahan (m²)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="luas_lahan"
                  name="luas_lahan"
                  value={formData.luas_lahan}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                  placeholder="Contoh: 1000"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="tanggal_tanam" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Tanam
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="tanggal_tanam"
                  name="tanggal_tanam"
                  value={formData.tanggal_tanam}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.luas_lahan || !formData.tanggal_tanam}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Selanjutnya
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
        {(formStep === 3 || isEditing) && (
          <div className={`space-y-4 ${formStep !== 3 && !isEditing ? 'hidden' : ''}`}>
            <div>
              <label htmlFor="hasil_panen" className="block text-sm font-medium text-gray-700 mb-1">
                Hasil Panen (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="hasil_panen"
                  name="hasil_panen"
                  value={formData.hasil_panen}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                  placeholder="Contoh: 500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <svg className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Masukkan jumlah total hasil panen dalam satuan kilogram</span>
              </div>
            </div>
            
            <div className="pt-3">
              {/* Calculate and show productivity */}
              {formData.luas_lahan && formData.hasil_panen && (
                <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-100">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Produktivitas</h3>
                  <p className="text-lg font-bold text-green-700">
                    {(
                      Number(formData.hasil_panen) / Number(formData.luas_lahan) * 10000
                    ).toFixed(2)}{' '}
                    <span className="text-sm font-normal">kg/hektar</span>
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditing ? 'Update Data' : 'Simpan Data'}
                    </span>
                  )}
                </button>
                
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
