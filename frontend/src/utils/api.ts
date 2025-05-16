import axios, { AxiosError } from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Error handling helper function
const handleApiError = (error: unknown, customMessage: string): ApiResponse<any> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    
    // Handle network errors
    if (!axiosError.response) {
      console.error('Network error:', error);
      return {
        success: false,
        error: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      };
    }
    
    // Handle API errors with response
    if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
      console.error(`API error (${axiosError.response.status}):`, axiosError.response.data);
      return {
        success: false,
        ...axiosError.response.data,
      };
    }
    
    // Fallback for other axios errors
    console.error(`Error ${axiosError.response?.status || ''}:`, axiosError.message);
    return {
      success: false,
      error: `Error ${axiosError.response?.status || ''}: ${customMessage}`,
    };
  }
  
  // Fallback for non-axios errors
  console.error('Unexpected error:', error);
  return {
    success: false,
    error: `Terjadi kesalahan: ${customMessage}`,
  };
};

// Define TypeScript interfaces
export interface PanenData {
  id?: number;
  nama_tanaman: string;
  luas_lahan: number;
  tanggal_tanam: string;
  hasil_panen: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// API functions for Panen (Harvest) data
export const panenApi = {  // Get all harvest records
  getAllPanen: async (): Promise<ApiResponse<PanenData[]>> => {
    try {
      const response = await api.get<ApiResponse<PanenData[]>>('/panen');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Gagal mengambil data panen');
    }
  },
  // Get a single harvest record by ID
  getPanenById: async (id: number): Promise<ApiResponse<PanenData>> => {
    try {
      const response = await api.get<ApiResponse<PanenData>>(`/panen/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Gagal mengambil data panen dengan ID ${id}`);
    }
  },
  // Create a new harvest record
  createPanen: async (panenData: PanenData): Promise<ApiResponse<PanenData>> => {
    try {
      const response = await api.post<ApiResponse<PanenData>>('/panen', panenData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Gagal menambahkan data panen baru');
    }
  },
  // Update an existing harvest record
  updatePanen: async (id: number, panenData: PanenData): Promise<ApiResponse<PanenData>> => {
    try {
      const response = await api.put<ApiResponse<PanenData>>(`/panen/${id}`, panenData);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Gagal memperbarui data panen dengan ID ${id}`);
    }
  },
  // Delete a harvest record
  deletePanen: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/panen/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Gagal menghapus data panen dengan ID ${id}`);
    }
  },
};

export default api;
