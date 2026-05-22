const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    requireRole("admin"),
    userController.getUsers
);

router.patch(
    "/:id/role",
    authMiddleware,
    requireRole("admin"),
    userController.updateUserRole
);

module.exports = router;
