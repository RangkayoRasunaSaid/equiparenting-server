const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/members", requireAuth, memberController.createMember);
router.get("/members", requireAuth, memberController.getAllMembersWithScores);
router.delete('/members/:memberId', requireAuth, memberController.deleteMember);

module.exports = router;
