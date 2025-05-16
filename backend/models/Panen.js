// Model for Panen (Harvest)
const db = require('../config/database');

class Panen {
  // Get all harvest records
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM panen ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single harvest record by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM panen WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new harvest record
  static async create(panenData) {
    try {
      const [result] = await db.query(
        'INSERT INTO panen (nama_tanaman, luas_lahan, tanggal_tanam, hasil_panen) VALUES (?, ?, ?, ?)',
        [panenData.nama_tanaman, panenData.luas_lahan, panenData.tanggal_tanam, panenData.hasil_panen]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing harvest record
  static async update(id, panenData) {
    try {
      const [result] = await db.query(
        'UPDATE panen SET nama_tanaman = ?, luas_lahan = ?, tanggal_tanam = ?, hasil_panen = ? WHERE id = ?',
        [panenData.nama_tanaman, panenData.luas_lahan, panenData.tanggal_tanam, panenData.hasil_panen, id]
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
          luas_lahan DECIMAL(10,2) NOT NULL,
          tanggal_tanam DATE NOT NULL,
          hasil_panen DECIMAL(10,2) NOT NULL,
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
