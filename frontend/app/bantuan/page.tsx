import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Bantuan Penggunaan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Panduan penggunaan aplikasi FarmEase
        </p>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Pertanyaan Umum</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Bagaimana cara menambahkan data panen?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Untuk menambahkan data panen baru, klik menu "Data Panen" di bagian atas, kemudian klik tombol "Tambah Data". 
              Isi formulir dengan informasi panen seperti nama tanaman, luas lahan, tanggal tanam, dan hasil panen, 
              lalu klik "Simpan Data".
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Bagaimana cara mengedit data panen yang sudah ada?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Di halaman "Data Panen", cari data yang ingin diedit. Kemudian klik ikon pensil pada bagian "Aksi" di baris data tersebut. 
              Edit informasi sesuai kebutuhan, lalu klik "Simpan Perubahan".
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Bagaimana cara menghapus data panen?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Di halaman "Data Panen", cari data yang ingin dihapus. Kemudian klik ikon tempat sampah pada bagian "Aksi". 
              Konfirmasi penghapusan ketika muncul pesan konfirmasi.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Bagaimana cara mengekspor data panen?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Di halaman "Data Panen", klik tombol "Excel" atau "PDF" di bagian atas tabel. 
              File dengan data panen akan otomatis diunduh.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Bagaimana cara melihat laporan grafik?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Klik menu "Laporan" di bagian atas untuk melihat halaman laporan. 
              Di sana Anda dapat melihat visualisasi data panen dalam bentuk grafik dan diagram.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-dark mb-6">Panduan Penggunaan</h2>
        
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">1. Registrasi dan Login</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Saat ini FarmEase tidak memerlukan registrasi. Anda dapat langsung menggunakan semua fitur aplikasi.
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">2. Menambahkan Data Panen</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Klik menu "Data Panen", lalu klik "Tambah Data". Isi semua informasi yang diperlukan dengan benar.
              Anda dapat mengisi informasi berikut:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 text-gray-600 dark:text-gray-300">
              <li>Nama Tanaman (mis. Padi, Jagung, Kedelai)</li>
              <li>Luas Lahan (dalam hektar)</li>
              <li>Tanggal Tanam</li>
              <li>Hasil Panen (dalam kilogram)</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">3. Melihat dan Mengelola Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Pada halaman "Data Panen", Anda dapat melihat semua data panen yang telah dimasukkan.
              Anda juga dapat mengedit atau menghapus data yang ada.
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">4. Analisis Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Pada halaman "Laporan", Anda dapat melihat visualisasi data panen. Ini membantu Anda menganalisis
              tren produktivitas dan membandingkan hasil panen dari berbagai jenis tanaman.
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">5. Mengekspor Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Anda dapat mengekspor data panen ke format Excel atau PDF dari halaman "Data Panen".
              Data yang diekspor mencakup semua informasi panen yang telah Anda masukkan.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Masih memiliki pertanyaan? Hubungi kami!
        </p>
        <p className="text-primary-dark font-medium">support@farmease.com</p>
      </div>
    </div>
  );
}
