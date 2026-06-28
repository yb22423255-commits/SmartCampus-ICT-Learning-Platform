const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Quiz = require("../models/Quiz");
const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

const canManageCourse = (course, user) =>
    user.role === "admin" || course.lecturerId === user.id;

const generateClassCode = async () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code, exists;
    do {
        code = Array.from({ length: 6 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join("");
        exists = await Course.findOne({ where: { classCode: code } });
    } while (exists);
    return code;
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description)
            return res.status(400).json({ message: "Title and description are required" });

        const classCode = await generateClassCode();
        const course = await Course.create({
            title, description,
            lecturerId: req.user.id,
            classCode
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({ order: [["id", "DESC"]] });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { lecturerId: req.user.id },
            order: [["id", "DESC"]]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseDetail = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const isLecturer = canManageCourse(course, req.user);
        const enrollment = await Enrollment.findOne({
            where: { studentId: req.user.id, courseId: course.id }
        });
        const isEnrolled = Boolean(enrollment);

        if (req.user.role === "student" && !isEnrolled)
            return res.status(403).json({ message: "Join this class first using the class code" });

        const lessons = await Lesson.findAll({
            where: { courseId: course.id },
            order: [["id", "DESC"]]
        });

        const quizzes = await Quiz.findAll({
            where: { courseId: course.id },
            attributes: isLecturer ? undefined : { exclude: ["correctAnswer"] },
            order: [["id", "DESC"]]
        });

        const assignments = await Assignment.findAll({
            where: { courseId: course.id },
            order: [["dueDate", "ASC"]]
        });

        let students = [];
        if (isLecturer) {
            const enrollments = await Enrollment.findAll({
                where: { courseId: course.id },
                include: [{
                    model: User, as: "student",
                    attributes: ["id", "fullName", "email", "role"]
                }]
            });
            students = enrollments.map(e => e.student);
        }

        res.json({ course, lessons, quizzes, assignments, students, isLecturer, isEnrolled });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};