const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { requireAuth } = require("../middlewares/authMiddleware");

// PUT route to update reward dates
router.put('/rewards/:id', requireAuth, rewardController.updateRewardDates);

// GET route to retrieve dates for a specific reward
router.get('/rewards/:id', requireAuth, rewardController.getRewardDates);

// GET route to retrieve dates for all rewards
router.get('/rewards', requireAuth, rewardController.getAllRewardDates);

// POST route to create new dates for a reward
router.post('/reward', requireAuth, rewardController.createRewardDates);

module.exports = router;
