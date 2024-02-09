const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/profile", requireAuth, userController.getUserProfile);
router.post("/update-profile", requireAuth, userController.updateUserProfile);
router.post("/update-password", requireAuth, userController.updateUserPassword);

module.exports = router;
