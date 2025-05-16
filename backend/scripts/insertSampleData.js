// Sample data insertion script
require('dotenv').config();
const mysql = require('mysql2/promise');

const samplePanenData = [
  {
    nama_tanaman: 'Padi',
    luas_lahan: 2500.00,
    tanggal_tanam: '2025-01-15',
    hasil_panen: 1850.50
  },
  {
    nama_tanaman: 'Jagung',
    luas_lahan: 1800.00,
    tanggal_tanam: '2025-02-10',
    hasil_panen: 2300.75
  },
  {
    nama_tanaman: 'Kedelai',
    luas_lahan: 1500.00,
    tanggal_tanam: '2025-01-20',
    hasil_panen: 750.25
  },
  {
    nama_tanaman: 'Cabai',
    luas_lahan: 800.00,
    tanggal_tanam: '2025-03-05',
    hasil_panen: 450.80
  },
  {
    nama_tanaman: 'Tomat',
    luas_lahan: 650.00,
    tanggal_tanam: '2025-03-12',
    hasil_panen: 825.60
  },
  {
    nama_tanaman: 'Padi',
    luas_lahan: 3000.00,
    tanggal_tanam: '2025-04-01',
    hasil_panen: 2250.00
  },
  {
    nama_tanaman: 'Jagung',
    luas_lahan: 2000.00,
    tanggal_tanam: '2025-04-15',
    hasil_panen: 2600.50
  }
];

async function insertSampleData() {
  let connection;
  
  try {
    // Create connection to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to database');
    
    // Check if table already has data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM panen');
    
    if (rows[0].count > 0) {
      console.log('Table already contains data. Skipping insertion.');
      return;
    }
    
    // Insert sample data
    for (const item of samplePanenData) {
      await connection.query(
        'INSERT INTO panen (nama_tanaman, luas_lahan, tanggal_tanam, hasil_panen) VALUES (?, ?, ?, ?)',
        [item.nama_tanaman, item.luas_lahan, item.tanggal_tanam, item.hasil_panen]
      );
    }
    
    console.log(`Successfully inserted ${samplePanenData.length} sample records into panen table`);
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Call the function to insert sample data
insertSampleData();
