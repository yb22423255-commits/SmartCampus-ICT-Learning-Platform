const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.joinByCode = async (req, res) => {
    try {
        const { classCode } = req.body;
        if (!classCode) return res.status(400).json({ message: "Class code is required" });

        const course = await Course.findOne({ where: { classCode: classCode.toUpperCase().trim() } });
        if (!course) return res.status(404).json({ message: "Invalid class code. Please check and try again." });

        const already = await Enrollment.findOne({ where: { studentId: req.user.id, courseId: course.id } });
        if (already) return res.status(400).json({ message: "You are already enrolled in this class." });

        await Enrollment.create({ studentId: req.user.id, courseId: course.id });
        res.status(201).json({ message: "Joined successfully!", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, as: "course" }]
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};