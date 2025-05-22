'use client';

import { useState } from 'react';

export default function EncryptionIndicator() {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-flex items-center">
      <button
        className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900 px-2 py-1 rounded-md hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Informasi Enkripsi Data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Data Terenkripsi</span>
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 text-sm z-10 animate-fadeIn">
          <div className="flex items-start mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Data panen Anda dilindungi dengan enkripsi AES-256 untuk keamanan maksimal.
            </p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            FarmEase menggunakan teknologi enkripsi modern untuk melindungi data sensitif Anda. 
            Hanya pemilik data yang dapat melihat informasi asli.
          </p>
        </div>
      )}
    </div>
  );
}