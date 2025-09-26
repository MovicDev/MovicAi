const express = require('express');
const router = express.Router();
const { getMovieData } = require('../controllers/aiController');

router.post('/movicai', getMovieData)


module.exports = router;