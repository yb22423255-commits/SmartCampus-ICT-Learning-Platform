const User = require("./User");
const Course = require("./Course");
const Enrollment = require("./Enrollment");
const Lesson = require("./Lesson");
const Quiz = require("./Quiz");
const QuizResult = require("./QuizResult");
const Assignment = require("./Assignment");
const Submission = require("./Submission");

User.hasMany(Enrollment, { foreignKey: "studentId", as: "enrollments" });
Enrollment.belongsTo(User, { foreignKey: "studentId", as: "student" });

Course.hasMany(Enrollment, { foreignKey: "courseId", as: "enrollments" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.belongsTo(User, { foreignKey: "lecturerId", as: "lecturer" });
User.hasMany(Course, { foreignKey: "lecturerId", as: "courses" });

Course.hasMany(Lesson, { foreignKey: "courseId", as: "lessons" });
Lesson.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(Quiz, { foreignKey: "courseId", as: "quizzes" });
Quiz.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(Assignment, { foreignKey: "courseId", as: "assignments" });
Assignment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Submission, { foreignKey: "studentId", as: "submissions" });
Submission.belongsTo(User, { foreignKey: "studentId", as: "student" });

Assignment.hasMany(Submission, { foreignKey: "assignmentId", as: "submissions" });
Submission.belongsTo(Assignment, { foreignKey: "assignmentId", as: "assignment" });

User.hasMany(QuizResult, { foreignKey: "studentId", as: "quizResults" });
QuizResult.belongsTo(User, { foreignKey: "studentId", as: "student" });

Quiz.hasMany(QuizResult, { foreignKey: "quizId", as: "results" });
QuizResult.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

module.exports = {
    User,
    Course,
    Enrollment,
    Lesson,
    Quiz,
    QuizResult,
    Assignment,
    Submission
};
