const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    requireRole("lecturer", "admin"),
    quizController.createQuiz
);

router.get(
    "/course/:courseId",
    authMiddleware,
    quizController.getCourseQuizzes
);

router.post(
    "/submit",
    authMiddleware,
    requireRole("student"),
    quizController.submitQuiz
);

module.exports = router;
