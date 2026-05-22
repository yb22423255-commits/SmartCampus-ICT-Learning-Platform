const express = require("express");
const router = express.Router();

const lessonController = require("../controllers/lessonController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const upload = require("../config/multer");

router.post(
    "/",
    authMiddleware,
    requireRole("lecturer", "admin"),
    upload.single("file"),
    lessonController.createLesson
);

router.get(
    "/course/:courseId",
    authMiddleware,
    lessonController.getLessons
);

module.exports = router;
