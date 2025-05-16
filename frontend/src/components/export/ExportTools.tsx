'use client';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PanenData } from '@/utils/api';

interface ExportToolsProps {
  data: any[];
  fileName: string;
  title?: string;
  showExcel?: boolean;
  showPDF?: boolean;
}

export default function ExportTools({
  data,
  fileName,
  title = 'Data Export',
  showExcel = true,
  showPDF = true
}: ExportToolsProps) {
  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelData, `${fileName}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);
    
    // Create table
    if (data.length > 0) {
      // Get columns from the first data entry
      const columns = Object.keys(data[0]);
      
      // Create header row
      const tableColumn = columns.map(col => {
        // Convert camelCase or snake_case to Title Case
        return col
          .replace(/_/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
      });
      
      // Create table rows
      const tableRows = data.map(item => {
        return columns.map(col => {
          const value = item[col];
          
          // Format dates
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            return new Date(value).toLocaleDateString('id-ID');
          }
          
          // Format numbers
          if (typeof value === 'number') {
            return value.toLocaleString('id-ID');
          }
          
          return value;
        });
      });
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          font: 'helvetica'
        },
        headStyles: {
          fillColor: [76, 175, 80],
          textColor: 255
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No data available', 14, 50);
    }
    
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div className="flex gap-2">
      {showExcel && (
        <button
          onClick={exportToExcel}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="10" y1="12" x2="14" y2="12" />
            <line x1="12" y1="10" x2="12" y2="14" />
            <line x1="10" y1="20" x2="14" y2="20" />
          </svg>
          Export Excel
        </button>
      )}
      
      {showPDF && (
        <button
          onClick={exportToPDF}
          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="12" x2="12" y2="18" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Export PDF
        </button>
      )}
    </div>
  );
}
