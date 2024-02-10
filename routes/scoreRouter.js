// scoreRouter.js

const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/score", scoreController.getAllScores); // New route to get all members

module.exports = router;
