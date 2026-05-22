const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "courseId is required" });
        }

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: {
                studentId: req.user.id,
                courseId
            }
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this course"
            });
        }

        const enrollment = await Enrollment.create({
            studentId: req.user.id,
            courseId
        });

        res.status(201).json({
            message: "Enrollment successful",
            enrollment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: {
                studentId: req.user.id
            },
            include: [
                {
                    model: Course,
                    as: "course"
                }
            ]
        });

        res.json(enrollments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
