const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { requireAuth } = require("../middlewares/authMiddleware");

// PUT route to update reward dates
router.put('/reset-score', requireAuth, scoreController.resetScore);

module.exports = router;
