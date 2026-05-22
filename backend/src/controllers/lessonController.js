const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

exports.createLesson = async (req, res) => {
    try {
        const { title, content, videoUrl, courseId } = req.body;

        if (!title || !content || !courseId) {
            return res.status(400).json({ message: "Title, content, and courseId are required" });
        }

        const course = await Course.findByPk(courseId);
        if (!course || (course.lecturerId !== req.user.id && req.user.role !== "admin")) {
            return res.status(403).json({ message: "You can only add lessons to your courses" });
        }

        const lesson = await Lesson.create({
            title,
            content,
            videoUrl,
            courseId,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll({
            where: { courseId: req.params.courseId },
            order: [["id", "DESC"]]
        });

        res.json(lessons);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
