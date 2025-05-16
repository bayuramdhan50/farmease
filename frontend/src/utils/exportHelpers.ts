import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PanenData } from './api';

// TypeScript interface for grouped data
export interface GroupedData {
  date: string;
  totalHarvest: number;
  totalArea: number;
  avgYield: number;
  count: number;
}

// TypeScript interface for crop analysis
export interface CropAnalysis {
  crop: string;
  totalHarvest: number;
  totalArea: number;
  avgYield: number;
  productivity: number; // kg/ha
  count: number;
}

// Format date to YYYY-MM-DD
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Format number with 2 decimal places and thousands separator
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

// Group harvest data by year and month
export const groupByDate = (data: PanenData[], groupBy: 'year' | 'month' | 'quarter' = 'year'): GroupedData[] => {
  const groupedData: Record<string, { totalHarvest: number; count: number; totalArea: number }> = {};
  
  data.forEach(item => {
    const date = new Date(item.tanggal_tanam);
    let key: string;
    
    if (groupBy === 'year') {
      key = date.getFullYear().toString();
    } else if (groupBy === 'month') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (groupBy === 'quarter') {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      key = `${date.getFullYear()} Q${quarter}`;
    } else {
      key = date.getFullYear().toString();
    }
    
    if (!groupedData[key]) {
      groupedData[key] = {
        totalHarvest: 0,
        count: 0,
        totalArea: 0
      };
    }
    
    groupedData[key].totalHarvest += parseFloat(String(item.hasil_panen));
    groupedData[key].totalArea += parseFloat(String(item.luas_lahan));
    groupedData[key].count += 1;
  });
  
  return Object.entries(groupedData).map(([date, values]) => ({
    date,
    ...values,
    avgYield: values.totalHarvest / values.totalArea
  }));
};

// Export data to Excel file
export const exportToExcel = (data: PanenData[], fileName = 'farmease_panen_data'): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Harvest Data');
  
  // Auto-size columns
  const columnsWidth: Record<string, number> = data.reduce((width: Record<string, number>, row) => {
    Object.keys(row).forEach(key => {
      const value = String(row[key as keyof PanenData] || '');
      width[key] = Math.max(width[key] || 0, value.length);
    });
    return width;
  }, {});
  
  worksheet['!cols'] = Object.keys(columnsWidth).map(key => ({
    wch: Math.min(columnsWidth[key] + 2, 50) // add padding, max width 50
  }));
  
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export data to PDF file
export const exportToPDF = (data: PanenData[], fileName = 'farmease_panen_data'): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(22, 163, 74); // primary green color
  doc.text('FarmEase - Laporan Hasil Panen', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal export: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
  
  // Prepare table data
  const tableColumn = Object.keys(data[0]).map(key => {
    // Format column headers (convert snake_case to Title Case)
    return key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });
  
  const tableRows = data.map(item => Object.values(item));
  
  // Add table to document
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244],
    },
  });
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('FarmEase - Aplikasi Pencatatan Hasil Panen', 14, doc.internal.pageSize.height - 10);
  
  // Save PDF
  doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Convert date string to local date format
export const localizeDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
