const express = require('express');
const router = express.Router();
const { User_Activity } = require('../models');

// Create a new user activity
router.post('/user-activities', async (req, res) => {
  try {
    const newUserActivity = await User_Activity.create(req.body);
    res.status(201).json(newUserActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all user activities
router.get('/user-activities', async (req, res) => {
  try {
    const userActivities = await User_Activity.findAll();
    res.json(userActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single user activity by ID
router.get('/user-activities/:id', async (req, res) => {
  try {
    const userActivity = await User_Activity.findByPk(req.params.id);
    if (!userActivity) {
      res.status(404).json({ message: 'User activity not found' });
    } else {
      res.json(userActivity);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user activity
router.put('/user-activities/:id', async (req, res) => {
  try {
    const userActivity = await User_Activity.findByPk(req.params.id);
    if (!userActivity) {
      res.status(404).json({ message: 'User activity not found' });
    } else {
      await userActivity.update(req.body);
      res.json(userActivity);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user activity
router.delete('/user-activities/:id', async (req, res) => {
  try {
    const userActivity = await User_Activity.findByPk(req.params.id);
    if (!userActivity) {
      res.status(404).json({ message: 'User activity not found' });
    } else {
      await userActivity.destroy();
      res.json({ message: 'User activity deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
