// Model for Panen (Harvest)
const db = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

class Panen {
  // Get all harvest records
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM panen ORDER BY id DESC');
      // Decrypt sensitive data before returning
      return rows.map(row => {
        if (row.nama_tanaman_encrypted) {
          row.nama_tanaman = decrypt(row.nama_tanaman_encrypted);
          delete row.nama_tanaman_encrypted;
        }
        if (row.catatan_encrypted) {
          row.catatan = decrypt(row.catatan_encrypted);
          delete row.catatan_encrypted;
        }
        if (row.lokasi_encrypted) {
          row.lokasi = decrypt(row.lokasi_encrypted);
          delete row.lokasi_encrypted;
        }
        return row;
      });
    } catch (error) {
      throw error;
    }
  }
  // Get a single harvest record by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM panen WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      // Decrypt sensitive data
      const row = rows[0];
      if (row.nama_tanaman_encrypted) {
        row.nama_tanaman = decrypt(row.nama_tanaman_encrypted);
        delete row.nama_tanaman_encrypted;
      }
      if (row.catatan_encrypted) {
        row.catatan = decrypt(row.catatan_encrypted);
        delete row.catatan_encrypted;
      }
      if (row.lokasi_encrypted) {
        row.lokasi = decrypt(row.lokasi_encrypted);
        delete row.lokasi_encrypted;
      }
      
      return row;
    } catch (error) {
      throw error;
    }
  }
  // Create a new harvest record
  static async create(panenData) {
    try {
      // Encrypt sensitive data
      const nama_tanaman_encrypted = encrypt(panenData.nama_tanaman);
      const catatan_encrypted = panenData.catatan ? encrypt(panenData.catatan) : null;
      const lokasi_encrypted = panenData.lokasi ? encrypt(panenData.lokasi) : null;
      
      const [result] = await db.query(
        'INSERT INTO panen (nama_tanaman, nama_tanaman_encrypted, luas_lahan, tanggal_tanam, hasil_panen, catatan, catatan_encrypted, lokasi, lokasi_encrypted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [panenData.nama_tanaman, nama_tanaman_encrypted, panenData.luas_lahan, panenData.tanggal_tanam, panenData.hasil_panen, panenData.catatan, catatan_encrypted, panenData.lokasi, lokasi_encrypted]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  // Update an existing harvest record
  static async update(id, panenData) {
    try {
      // Encrypt sensitive data
      const nama_tanaman_encrypted = encrypt(panenData.nama_tanaman);
      const catatan_encrypted = panenData.catatan ? encrypt(panenData.catatan) : null;
      const lokasi_encrypted = panenData.lokasi ? encrypt(panenData.lokasi) : null;
      
      const [result] = await db.query(
        'UPDATE panen SET nama_tanaman = ?, nama_tanaman_encrypted = ?, luas_lahan = ?, tanggal_tanam = ?, hasil_panen = ?, catatan = ?, catatan_encrypted = ?, lokasi = ?, lokasi_encrypted = ? WHERE id = ?',
        [panenData.nama_tanaman, nama_tanaman_encrypted, panenData.luas_lahan, panenData.tanggal_tanam, panenData.hasil_panen, panenData.catatan, catatan_encrypted, panenData.lokasi, lokasi_encrypted, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete a harvest record
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM panen WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // Create the panen table if it doesn't exist
  static async initTable() {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS panen (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nama_tanaman VARCHAR(100) NOT NULL,
          nama_tanaman_encrypted TEXT,
          luas_lahan DECIMAL(10,2) NOT NULL,
          tanggal_tanam DATE NOT NULL,
          hasil_panen DECIMAL(10,2) NOT NULL,
          catatan TEXT,
          catatan_encrypted TEXT,
          lokasi VARCHAR(255),
          lokasi_encrypted TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Panen table initialized');
    } catch (error) {
      console.error('Error initializing panen table:', error);
      throw error;
    }
  }
}

module.exports = Panen;
