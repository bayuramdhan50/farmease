'use client';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ size = 'medium', fullScreen = false, text = 'Loading...' }: LoaderProps) {
  // Size mapping
  const sizeMap = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  };
  
  const spinnerSize = sizeMap[size];
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center">
          <div className={`${spinnerSize} border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
          {text && <p className="mt-4 text-gray-600 dark:text-gray-300">{text}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`${spinnerSize} border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{text}</p>}
    </div>
  );
}
