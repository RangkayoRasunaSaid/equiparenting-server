// memberRouter.js

const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/member", requireAuth, memberController.createMember);
router.get("/members", memberController.getAllMembers); // New route to get all members
router.delete('/members/:memberId', memberController.deleteMember);

module.exports = router;
