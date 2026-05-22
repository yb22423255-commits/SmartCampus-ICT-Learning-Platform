const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createQuiz = async (req, res) => {
    try {
        const {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            courseId
        } = req.body;

        if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !courseId) {
            return res.status(400).json({ message: "All quiz fields are required" });
        }

        const course = await Course.findByPk(courseId);
        if (!course || (course.lecturerId !== req.user.id && req.user.role !== "admin")) {
            return res.status(403).json({ message: "You can only add quizzes to your courses" });
        }

        const quiz = await Quiz.create({
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            courseId
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseQuizzes = async (req, res) => {
    try {
        const isLecturer = req.user.role === "lecturer" || req.user.role === "admin";

        const quizzes = await Quiz.findAll({
            where: { courseId: req.params.courseId },
            attributes: isLecturer ? undefined : { exclude: ["correctAnswer"] },
            order: [["id", "DESC"]]
        });

        res.json(quizzes);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, selectedAnswer } = req.body;

        if (!quizId || !selectedAnswer) {
            return res.status(400).json({ message: "quizId and selectedAnswer are required" });
        }

        const quiz = await Quiz.findByPk(quizId);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const enrolled = await Enrollment.findOne({
            where: {
                studentId: req.user.id,
                courseId: quiz.courseId
            }
        });

        if (!enrolled) {
            return res.status(403).json({ message: "Enroll in the course first" });
        }

        let score = 0;

        if (selectedAnswer === quiz.correctAnswer) {
            score = 1;
        }

        const result = await QuizResult.create({
            studentId: req.user.id,
            quizId,
            selectedAnswer,
            score
        });

        res.json({
            message: "Quiz submitted",
            result,
            passed: score === 1
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
