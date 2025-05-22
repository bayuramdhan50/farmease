// Utilities for data encryption and decryption
const crypto = require('crypto');
require('dotenv').config();

// The encryption key should be a 32 byte (256 bit) key for AES-256
// Use a strong, randomly generated key in production and store it securely
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'this-is-a-32-byte-key-for-aes-256'; // In production, set in .env
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypt a string or JSON object
 * @param {string|object} text - The data to encrypt
 * @returns {string} - The encrypted data as a base64 string
 */
function encrypt(text) {
  if (!text) return null;
  
  // Convert object to string if necessary
  const data = typeof text === 'object' ? JSON.stringify(text) : text;
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Prepend IV to encrypted data for later use in decryption
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt a previously encrypted string
 * @param {string} encryptedText - The encrypted data (IV:encryptedData format)
 * @param {boolean} parseJson - Whether to parse the result as JSON
 * @returns {string|object} - The decrypted data
 */
function decrypt(encryptedText, parseJson = false) {
  if (!encryptedText) return null;
  
  // Extract IV and encrypted data
  const textParts = encryptedText.split(':');
  if (textParts.length !== 2) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedData = textParts[1];
  
  // Create decipher
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  // Parse as JSON if requested
  if (parseJson) {
    try {
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error parsing decrypted JSON:', e);
      return decrypted;
    }
  }
  
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};