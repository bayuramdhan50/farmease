// Routes for Panen (Harvest)
const express = require('express');
const router = express.Router();
const panenController = require('../controllers/panenController');

// GET all panen records
router.get('/', panenController.getAllPanen);

// GET a single panen record
router.get('/:id', panenController.getPanenById);

// POST a new panen record
router.post('/', panenController.createPanen);

// PUT/update a panen record
router.put('/:id', panenController.updatePanen);

// DELETE a panen record
router.delete('/:id', panenController.deletePanen);

module.exports = router;
