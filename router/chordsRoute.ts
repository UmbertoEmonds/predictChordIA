import express from 'express';
const router = express.Router();

const chordsController = require('../controllers/ChordsController');

router.get('/predict', chordsController.predictChord);

module.exports = router;