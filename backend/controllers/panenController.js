// Controller for Panen (Harvest)
const Panen = require('../models/Panen');

exports.getAllPanen = async (req, res) => {
  try {
    const panen = await Panen.getAll();
    res.status(200).json({
      success: true,
      count: panen.length,
      data: panen
    });
  } catch (error) {
    console.error('Error fetching panen data:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.getPanenById = async (req, res) => {
  try {
    const id = req.params.id;
    const panen = await Panen.getById(id);
    
    if (!panen) {
      return res.status(404).json({
        success: false,
        message: `Panen with id ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: panen
    });
  } catch (error) {
    console.error(`Error fetching panen with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.createPanen = async (req, res) => {
  try {
    // Validate request body
    const { nama_tanaman, luas_lahan, tanggal_tanam, hasil_panen } = req.body;
    
    if (!nama_tanaman || !luas_lahan || !tanggal_tanam || !hasil_panen) {
      return res.status(400).json({
        success: false,
        message: 'Please provide nama_tanaman, luas_lahan, tanggal_tanam, and hasil_panen'
      });
    }

    const result = await Panen.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Panen record created successfully',
      data: {
        id: result.insertId,
        ...req.body
      }
    });
  } catch (error) {
    console.error('Error creating panen record:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.updatePanen = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if panen exists
    const panen = await Panen.getById(id);
    if (!panen) {
      return res.status(404).json({
        success: false,
        message: `Panen with id ${id} not found`
      });
    }
    
    // Validate request body
    const { nama_tanaman, luas_lahan, tanggal_tanam, hasil_panen } = req.body;
    if (!nama_tanaman || !luas_lahan || !tanggal_tanam || !hasil_panen) {
      return res.status(400).json({
        success: false,
        message: 'Please provide nama_tanaman, luas_lahan, tanggal_tanam, and hasil_panen'
      });
    }

    const result = await Panen.update(id, req.body);
    
    res.status(200).json({
      success: true,
      message: `Panen with id ${id} updated successfully`,
      data: {
        id: Number(id),
        ...req.body
      }
    });
  } catch (error) {
    console.error(`Error updating panen with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.deletePanen = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if panen exists
    const panen = await Panen.getById(id);
    if (!panen) {
      return res.status(404).json({
        success: false,
        message: `Panen with id ${id} not found`
      });
    }
    
    await Panen.delete(id);
    
    res.status(200).json({
      success: true,
      message: `Panen with id ${id} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting panen with id ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
