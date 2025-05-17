-- Initialize farmdb database tables
USE farmdb;

-- Create panen table if not exists
CREATE TABLE IF NOT EXISTS panen (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_tanaman VARCHAR(100) NOT NULL,
  luas_lahan DECIMAL(10, 2) NOT NULL,
  tanggal_tanam DATE NOT NULL,
  hasil_panen DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data if table is empty
INSERT INTO panen (nama_tanaman, luas_lahan, tanggal_tanam, hasil_panen)
SELECT * FROM (
  SELECT 'Padi', 2500.00, '2025-01-15', 1850.50 UNION ALL
  SELECT 'Jagung', 1800.00, '2025-02-10', 2300.75 UNION ALL
  SELECT 'Kedelai', 1500.00, '2025-01-20', 750.25 UNION ALL
  SELECT 'Cabai', 800.00, '2025-03-05', 450.80 UNION ALL
  SELECT 'Tomat', 650.00, '2025-03-12', 825.60 UNION ALL
  SELECT 'Padi', 3000.00, '2025-04-01', 2250.00 UNION ALL
  SELECT 'Jagung', 2000.00, '2025-04-15', 2600.50 UNION ALL
  SELECT 'Kacang Hijau', 1200.00, '2025-03-20', 950.30 UNION ALL
  SELECT 'Bayam', 500.00, '2025-02-25', 350.00 UNION ALL
  SELECT 'Padi Organik', 1800.00, '2025-01-10', 1600.00
) as tmp
WHERE NOT EXISTS (SELECT * FROM panen LIMIT 1);
