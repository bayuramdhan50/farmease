// Script to migrate existing data to include encryption
require('dotenv').config();
const db = require('../config/database');
const { encrypt } = require('../utils/encryption');

async function migrateData() {
  try {
    console.log('Starting data migration for encryption...');
    
    // Check and add nama_tanaman_encrypted column
    const [namaTanamanColumns] = await db.query('SHOW COLUMNS FROM panen LIKE "nama_tanaman_encrypted"');
    if (namaTanamanColumns.length === 0) {
      console.log('Adding nama_tanaman_encrypted column...');
      await db.query('ALTER TABLE panen ADD COLUMN nama_tanaman_encrypted TEXT AFTER nama_tanaman');
    }
    
    // Check and add catatan field if it doesn't exist
    const [catatanColumns] = await db.query('SHOW COLUMNS FROM panen LIKE "catatan"');
    if (catatanColumns.length === 0) {
      console.log('Adding catatan column...');
      await db.query('ALTER TABLE panen ADD COLUMN catatan TEXT AFTER hasil_panen');
    }
    
    // Check and add catatan_encrypted field
    const [catatanEncryptedColumns] = await db.query('SHOW COLUMNS FROM panen LIKE "catatan_encrypted"');
    if (catatanEncryptedColumns.length === 0) {
      console.log('Adding catatan_encrypted column...');
      await db.query('ALTER TABLE panen ADD COLUMN catatan_encrypted TEXT AFTER catatan');
    }
    
    // Check and add lokasi field if it doesn't exist
    const [lokasiColumns] = await db.query('SHOW COLUMNS FROM panen LIKE "lokasi"');
    if (lokasiColumns.length === 0) {
      console.log('Adding lokasi column...');
      await db.query('ALTER TABLE panen ADD COLUMN lokasi VARCHAR(255) AFTER catatan_encrypted');
    }
    
    // Check and add lokasi_encrypted field
    const [lokasiEncryptedColumns] = await db.query('SHOW COLUMNS FROM panen LIKE "lokasi_encrypted"');
    if (lokasiEncryptedColumns.length === 0) {
      console.log('Adding lokasi_encrypted column...');
      await db.query('ALTER TABLE panen ADD COLUMN lokasi_encrypted TEXT AFTER lokasi');
    }
    
    // Get all records for encryption
    const [rows] = await db.query('SELECT id, nama_tanaman, catatan, lokasi FROM panen');
    console.log(`Found ${rows.length} records to encrypt`);
    
    // Encrypt and update each record
    for (const row of rows) {
      // Encrypt nama_tanaman
      if (row.nama_tanaman && !await isAlreadyEncrypted('nama_tanaman_encrypted', row.id)) {
        const encryptedNamaTanaman = encrypt(row.nama_tanaman);
        await db.query('UPDATE panen SET nama_tanaman_encrypted = ? WHERE id = ?', [encryptedNamaTanaman, row.id]);
        console.log(`Encrypted nama_tanaman for record ID: ${row.id}`);
      }
      
      // Encrypt catatan if exists
      if (row.catatan && !await isAlreadyEncrypted('catatan_encrypted', row.id)) {
        const encryptedCatatan = encrypt(row.catatan);
        await db.query('UPDATE panen SET catatan_encrypted = ? WHERE id = ?', [encryptedCatatan, row.id]);
        console.log(`Encrypted catatan for record ID: ${row.id}`);
      }
      
      // Encrypt lokasi if exists
      if (row.lokasi && !await isAlreadyEncrypted('lokasi_encrypted', row.id)) {
        const encryptedLokasi = encrypt(row.lokasi);
        await db.query('UPDATE panen SET lokasi_encrypted = ? WHERE id = ?', [encryptedLokasi, row.id]);
        console.log(`Encrypted lokasi for record ID: ${row.id}`);
      }
    }
    
    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during data migration:', error);
  } finally {
    process.exit(0);
  }
}

// Helper function to check if a field is already encrypted
async function isAlreadyEncrypted(fieldName, id) {
  const [result] = await db.query(`SELECT ${fieldName} FROM panen WHERE id = ?`, [id]);
  return result.length > 0 && result[0][fieldName] !== null && result[0][fieldName] !== '';
}

migrateData();