'use client';

import { useToast } from '@/contexts/ToastContext';

/**
 * Custom hook for handling API errors with toast notifications
 */
export function useApiWithToast() {
  const { showToast } = useToast();

  /**
   * Shows a toast notification for API operation status
   * 
   * @param success Whether the operation was successful
   * @param successMessage Message to show on success
   * @param errorMessage Message to show on error
   * @param error Error object or string
   */
  const showApiToast = (
    success: boolean, 
    successMessage: string, 
    errorMessage: string, 
    error?: string
  ) => {
    if (success) {
      showToast('success', successMessage);
    } else {
      showToast('error', error || errorMessage);
    }
  };

  return { showApiToast };
}
