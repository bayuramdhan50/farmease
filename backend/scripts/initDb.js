// Database initialization script
require('dotenv').config();
const mysql = require('mysql2/promise');

async function initializeDatabase() {
  let connection;
  
  try {
    // Create connection without database selection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);
    
    // Create the panen table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS panen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_tanaman VARCHAR(100) NOT NULL,
        luas_lahan DECIMAL(10,2) NOT NULL,
        tanggal_tanam DATE NOT NULL,
        hasil_panen DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Table panen created or already exists');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the initialization function
initializeDatabase();
