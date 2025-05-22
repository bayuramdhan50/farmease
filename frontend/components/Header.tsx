'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll event for header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={`${scrolled ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-md' : 'bg-white dark:bg-gray-800'} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary-dark font-bold text-2xl">
            <Link href="/" className="flex items-center transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700 font-bold">FarmEase</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-500 hover:text-primary-dark focus:outline-none transition-transform active:scale-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
        <nav className="hidden md:flex space-x-1">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              isActiveLink('/') 
                ? 'text-white bg-primary-dark' 
                : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/panen" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              pathname.startsWith('/panen') 
                ? 'text-white bg-primary-dark' 
                : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            Data Panen
          </Link>
          <Link 
            href="/laporan" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              isActiveLink('/laporan') 
                ? 'text-white bg-primary-dark' 
                : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            Laporan
          </Link>
          <Link 
            href="/sdgs" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${
              isActiveLink('/sdgs') 
                ? 'text-white bg-primary-dark' 
                : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            <span>SDGs</span>
            <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
          </Link>
          <Link 
            href="/tentang" 
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              isActiveLink('/tentang') 
                ? 'text-white bg-primary-dark' 
                : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            Tentang
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-md">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActiveLink('/') 
                  ? 'text-white bg-primary-dark' 
                  : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
              }`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/panen" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith('/panen') 
                  ? 'text-white bg-primary-dark' 
                  : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
              }`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Data Panen
            </Link>
            <Link 
              href="/laporan" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActiveLink('/laporan') 
                  ? 'text-white bg-primary-dark' 
                  : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
              }`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Laporan
            </Link>
            <Link 
              href="/sdgs" 
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActiveLink('/sdgs') 
                  ? 'text-white bg-primary-dark' 
                  : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
              }`} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>SDGs</span>
              <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
            </Link>
            <Link 
              href="/tentang" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActiveLink('/tentang') 
                  ? 'text-white bg-primary-dark' 
                  : 'text-gray-600 hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900'
              }`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
