// Main application file
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Panen = require('./models/Panen');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const panenRoutes = require('./routes/panenRoutes');
app.use('/api/panen', panenRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FarmEase API - Aplikasi Pencatatan Hasil Panen Petani'
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database tables
    await Panen.initTable();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API is available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();