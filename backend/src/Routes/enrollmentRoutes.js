const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    requireRole("student"),
    enrollmentController.enrollCourse
);

router.get(
    "/my-courses",
    authMiddleware,
    requireRole("student"),
    enrollmentController.getStudentCourses
);

module.exports = router;
