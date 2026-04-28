const express = require("express");
const { authRequired, requireRole } = require("../../middleware/auth");
const adminUsersController = require("../../controllers/adminUsers.controller");

const router = express.Router();

router.use(authRequired, requireRole("master_admin"));

router.get("/", adminUsersController.listUsers);

router.post("/", adminUsersController.createUser);

router.patch("/:userId", adminUsersController.updateUser);
router.post("/:userId/reactivate-plan", adminUsersController.reactivateUserPlan);

module.exports = router;
