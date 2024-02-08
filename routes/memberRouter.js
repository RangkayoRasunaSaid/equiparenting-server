const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/member", requireAuth, memberController.createMember);

module.exports = router;
