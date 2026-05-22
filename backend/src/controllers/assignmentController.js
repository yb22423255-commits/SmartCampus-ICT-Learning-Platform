const { Op } = require("sequelize");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, courseId } = req.body;

        if (!title || !description || !dueDate || !courseId) {
            return res.status(400).json({ message: "All assignment fields are required" });
        }

        const course = await Course.findByPk(courseId);
        if (!course || (course.lecturerId !== req.user.id && req.user.role !== "admin")) {
            return res.status(403).json({ message: "You can only add assignments to your courses" });
        }

        const assignment = await Assignment.create({
            title,
            description,
            dueDate,
            courseId
        });

        res.status(201).json({
            message: "Assignment created successfully",
            assignment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            where: { courseId: req.params.courseId },
            order: [["dueDate", "ASC"]]
        });

        res.json(assignments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyAssignments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { studentId: req.user.id },
            attributes: ["courseId"]
        });

        const courseIds = enrollments.map((e) => e.courseId);

        if (courseIds.length === 0) {
            return res.json([]);
        }

        const assignments = await Assignment.findAll({
            where: { courseId: { [Op.in]: courseIds } },
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title"]
                }
            ],
            order: [["dueDate", "ASC"]]
        });

        res.json(assignments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseSubmissions = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.courseId);

        if (!course || (course.lecturerId !== req.user.id && req.user.role !== "admin")) {
            return res.status(403).json({ message: "Access denied" });
        }

        const assignments = await Assignment.findAll({
            where: { courseId: course.id },
            include: [
                {
                    model: Submission,
                    as: "submissions",
                    include: [
                        {
                            model: User,
                            as: "student",
                            attributes: ["id", "fullName", "email"]
                        }
                    ]
                }
            ]
        });

        res.json(assignments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        const { grade } = req.body;

        if (!grade) {
            return res.status(400).json({ message: "Grade is required" });
        }

        const submission = await Submission.findByPk(req.params.id, {
            include: [
                {
                    model: Assignment,
                    as: "assignment",
                    include: [{ model: Course, as: "course" }]
                }
            ]
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const course = submission.assignment.course;

        if (course.lecturerId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        submission.grade = grade;
        await submission.save();

        res.json({
            message: "Grade updated",
            submission
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;

        if (!assignmentId) {
            return res.status(400).json({ message: "assignmentId is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Assignment file is required" });
        }

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const enrolled = await Enrollment.findOne({
            where: {
                studentId: req.user.id,
                courseId: assignment.courseId
            }
        });

        if (!enrolled) {
            return res.status(403).json({ message: "Enroll in the course first" });
        }

        const submission = await Submission.create({
            studentId: req.user.id,
            assignmentId,
            fileUrl: `/uploads/${req.file.filename}`
        });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submission
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
