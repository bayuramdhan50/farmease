'use client';

import Link from 'next/link';

interface SDGBadgeProps {
  number: number;
  title: string;
  color: string;
  icon: string;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SDGBadge({ 
  number, 
  title, 
  color, 
  icon, 
  showTitle = false,
  size = 'md'
}: SDGBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };
  
  return (
    <Link href="/sdgs" className="inline-flex items-center hover:opacity-90 transition-opacity">
      <div className={`flex items-center justify-center ${color} text-white rounded-full ${sizeClasses[size]} flex-shrink-0`}>
        <span className="font-semibold">{icon}</span>
      </div>
      {showTitle && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          SDG {number}: {title}
        </span>
      )}
    </Link>
  );
}
