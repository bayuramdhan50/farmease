'use client';

import PanenTable from "@/components/PanenTable";
import Link from "next/link";
import EncryptionIndicator from "@/components/EncryptionIndicator";

export default function PanenPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Hasil Panen</h1>
          <EncryptionIndicator />
        </div>
        <Link 
          href="/panen/add" 
          className="btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Data
        </Link>
      </div>
      
      <PanenTable />
    </div>
  );
}
