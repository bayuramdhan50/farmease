'use client';

// API Utilities

/**
 * Get the base API URL from environment variables
 * Default to localhost:5000/api if not set
 */
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - The API endpoint path (without leading slash)
 * @returns The full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/${endpoint.replace(/^\//, '')}`;
};

/**
 * Get the API URL for panen endpoints
 * @param id - Optional ID for specific panen item
 * @returns The panen API URL
 */
export const getPanenApiUrl = (id?: number | string): string => {
  return id ? getApiUrl(`panen/${id}`) : getApiUrl('panen');
};
