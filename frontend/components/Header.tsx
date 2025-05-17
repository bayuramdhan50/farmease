'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary-dark font-bold text-2xl">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              FarmEase
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-primary-dark focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-primary-dark font-medium">
            Dashboard
          </Link>
          <Link href="/panen" className="text-gray-600 hover:text-primary-dark font-medium">
            Data Panen
          </Link>
          <Link href="/laporan" className="text-gray-600 hover:text-primary-dark font-medium">
            Laporan
          </Link>
          <Link href="/sdgs" className="text-gray-600 hover:text-primary-dark font-medium flex items-center">
            <span>SDGs</span>
            <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
          </Link>
          <Link href="/tentang" className="text-gray-600 hover:text-primary-dark font-medium">
            Tentang
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-md">
            <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-primary-dark font-medium" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/panen" className="block px-3 py-2 text-gray-600 hover:text-primary-dark font-medium" onClick={() => setIsMenuOpen(false)}>
              Data Panen
            </Link>
            <Link href="/laporan" className="block px-3 py-2 text-gray-600 hover:text-primary-dark font-medium" onClick={() => setIsMenuOpen(false)}>
              Laporan
            </Link>
            <Link href="/sdgs" className="block px-3 py-2 text-gray-600 hover:text-primary-dark font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span>SDGs</span>
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
            </Link>
            <Link href="/tentang" className="block px-3 py-2 text-gray-600 hover:text-primary-dark font-medium" onClick={() => setIsMenuOpen(false)}>
              Tentang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
