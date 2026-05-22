import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:5000";

const CourseDetail = () => {
    const { courseId } = useParams();
    const { isStaff } = useAuth();
    const [data, setData] = useState(null);
    const [tab, setTab] = useState("materials");
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState("");

    const [lessonForm, setLessonForm] = useState({
        title: "", content: "", videoUrl: "", file: null
    });
    const [quizForm, setQuizForm] = useState({
        question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A"
    });
    const [assignmentForm, setAssignmentForm] = useState({
        title: "", description: "", dueDate: ""
    });
    const [quizAnswers, setQuizAnswers] = useState({});
    const [submitFiles, setSubmitFiles] = useState({});

    const loadCourse = async () => {
        try {
            const res = await API.get(`/courses/${courseId}`);
            setData(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Cannot load course");
        }
    };

    const loadSubmissions = async () => {
        try {
            const res = await API.get(`/assignments/course/${courseId}/submissions`);
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCourse().then(r => {});
    }, [courseId]);

    useEffect(() => {
        if (data?.isLecturer && tab === "grading") {
            loadSubmissions().then(r => {});
        }
    }, [data, tab]);

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", lessonForm.title);
        formData.append("content", lessonForm.content);
        formData.append("videoUrl", lessonForm.videoUrl);
        formData.append("courseId", courseId);
        if (lessonForm.file) formData.append("file", lessonForm.file);

        try {
            await API.post("/lessons", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setLessonForm({ title: "", content: "", videoUrl: "", file: null });
            alert("Lesson uploaded!");
            await loadCourse();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to upload lesson");
        }
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            await API.post("/quizzes", {
                ...quizForm,
                courseId: Number(courseId)
            });
            setQuizForm({
                question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A"
            });
            alert("Quiz created!");
            loadCourse();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create quiz");
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await API.post("/assignments", {
                ...assignmentForm,
                courseId: Number(courseId)
            });
            setAssignmentForm({ title: "", description: "", dueDate: "" });
            alert("Assignment created!");
            loadCourse();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create assignment");
        }
    };

    const handleQuizSubmit = async (quizId) => {
        const selectedAnswer = quizAnswers[quizId];
        if (!selectedAnswer) {
            alert("Select an answer first");
            return;
        }
        try {
            const res = await API.post("/quizzes/submit", { quizId, selectedAnswer });
            alert(res.data.passed ? "Correct! Well done." : "Submitted. Try reviewing the material.");
            loadCourse();
        } catch (err) {
            alert(err.response?.data?.message || "Quiz submit failed");
        }
    };

    const handleAssignmentSubmit = async (assignmentId) => {
        const file = submitFiles[assignmentId];
        if (!file) {
            alert("Choose a file first");
            return;
        }
        const formData = new FormData();
        formData.append("assignmentId", assignmentId);
        formData.append("file", file);

        try {
            await API.post("/assignments/submit", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Assignment submitted!");
            loadCourse();
        } catch (err) {
            alert(err.response?.data?.message || "Submit failed");
        }
    };

    const handleGrade = async (submissionId) => {
        const grade = prompt("Enter grade (e.g. A, B+, 85%):");
        if (!grade) return;
        try {
            await API.patch(`/assignments/submissions/${submissionId}/grade`, { grade });
            alert("Grade saved!");
            loadSubmissions();
        } catch (err) {
            alert(err.response?.data?.message || "Grading failed");
        }
    };

    if (error) {
        return (
            <div className="page-content">
                <p className="error-text">{error}</p>
                <Link to="/courses">Back to courses</Link>
            </div>
        );
    }

    if (!data) {
        return <div className="page-content"><p>Loading classroom...</p></div>;
    }

    const { course, lessons, quizzes, assignments, students, isLecturer } = data;
    const showLecturer = isLecturer || isStaff;

    const tabs = showLecturer
        ? ["materials", "quizzes", "assignments", "students", "grading"]
        : ["materials", "quizzes", "assignments"];

    return (
        <div className="page-content">
            <Link to="/courses" className="back-link">← Back to courses</Link>
            <h1>{course.title}</h1>
            <p className="subtitle">{course.description}</p>

            <div className="tabs">
                {tabs.map((t) => (
                    <button
                        key={t}
                        type="button"
                        className={tab === t ? "tab active" : "tab"}
                        onClick={() => setTab(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === "materials" && (
                <section className="section-block">
                    {showLecturer && (
                        <form className="panel-form" onSubmit={handleCreateLesson}>
                            <h3>Upload Course Material</h3>
                            <input
                                placeholder="Lesson title"
                                value={lessonForm.title}
                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Lesson content / notes"
                                value={lessonForm.content}
                                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Video URL (optional)"
                                value={lessonForm.videoUrl}
                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                            />
                            <input
                                type="file"
                                onChange={(e) => setLessonForm({ ...lessonForm, file: e.target.files[0] })}
                            />
                            <button type="submit" className="btn">Upload Material</button>
                        </form>
                    )}

                    <div className="card-grid">
                        {lessons.length === 0 && <p>No materials uploaded yet.</p>}
                        {lessons.map((lesson) => (
                            <div className="card" key={lesson.id}>
                                <h3>{lesson.title}</h3>
                                <p>{lesson.content}</p>
                                {lesson.videoUrl && (
                                    <p>
                                        <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                                            Watch video
                                        </a>
                                    </p>
                                )}
                                {lesson.fileUrl && (
                                    <p>
                                        <a href={`${API_BASE}${lesson.fileUrl}`} target="_blank" rel="noreferrer">
                                            Download file
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === "quizzes" && (
                <section className="section-block">
                    {showLecturer && (
                        <form className="panel-form" onSubmit={handleCreateQuiz}>
                            <h3>Create Quiz</h3>
                            <input
                                placeholder="Question"
                                value={quizForm.question}
                                onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                                required
                            />
                            {["A", "B", "C", "D"].map((opt) => (
                                <input
                                    key={opt}
                                    placeholder={`Option ${opt}`}
                                    value={quizForm[`option${opt}`]}
                                    onChange={(e) => setQuizForm({ ...quizForm, [`option${opt}`]: e.target.value })}
                                    required
                                />
                            ))}
                            <select
                                value={quizForm.correctAnswer}
                                onChange={(e) => setQuizForm({ ...quizForm, correctAnswer: e.target.value })}
                            >
                                <option value="A">Correct: A</option>
                                <option value="B">Correct: B</option>
                                <option value="C">Correct: C</option>
                                <option value="D">Correct: D</option>
                            </select>
                            <button type="submit" className="btn">Create Quiz</button>
                        </form>
                    )}

                    <div className="card-grid">
                        {quizzes.length === 0 && <p>No quizzes yet.</p>}
                        {quizzes.map((quiz) => (
                            <div className="card" key={quiz.id}>
                                <h3>{quiz.question}</h3>
                                {!showLecturer ? (
                                    <div className="quiz-options">
                                        {["A", "B", "C", "D"].map((opt) => (
                                            <label key={opt} className="radio-label">
                                                <input
                                                    type="radio"
                                                    name={`quiz-${quiz.id}`}
                                                    value={opt}
                                                    checked={quizAnswers[quiz.id] === opt}
                                                    onChange={() => setQuizAnswers({ ...quizAnswers, [quiz.id]: opt })}
                                                />
                                                {opt}: {quiz[`option${opt}`]}
                                            </label>
                                        ))}
                                        <button
                                            className="btn btn-inline"
                                            onClick={() => handleQuizSubmit(quiz.id)}
                                        >
                                            Submit Answer
                                        </button>
                                    </div>
                                ) : (
                                    <ul className="quiz-admin">
                                        <li>A: {quiz.optionA}</li>
                                        <li>B: {quiz.optionB}</li>
                                        <li>C: {quiz.optionC}</li>
                                        <li>D: {quiz.optionD}</li>
                                        <li><strong>Answer: {quiz.correctAnswer}</strong></li>
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === "assignments" && (
                <section className="section-block">
                    {showLecturer && (
                        <form className="panel-form" onSubmit={handleCreateAssignment}>
                            <h3>Create Assignment</h3>
                            <input
                                placeholder="Title"
                                value={assignmentForm.title}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={assignmentForm.description}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                value={assignmentForm.dueDate}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                                required
                            />
                            <button type="submit" className="btn">Create Assignment</button>
                        </form>
                    )}

                    <div className="card-grid">
                        {assignments.length === 0 && <p>No assignments yet.</p>}
                        {assignments.map((a) => (
                            <div className="card" key={a.id}>
                                <h3>{a.title}</h3>
                                <p>{a.description}</p>
                                <p>Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                                {!showLecturer && (
                                    <>
                                        <input
                                            type="file"
                                            onChange={(e) => setSubmitFiles({
                                                ...submitFiles,
                                                [a.id]: e.target.files[0]
                                            })}
                                        />
                                        <button
                                            className="btn btn-inline"
                                            onClick={() => handleAssignmentSubmit(a.id)}
                                        >
                                            Submit Assignment
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === "students" && showLecturer && (
                <section className="section-block">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 && (
                                <tr><td colSpan="3">No students enrolled yet.</td></tr>
                            )}
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.fullName}</td>
                                    <td>{s.email}</td>
                                    <td>{s.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {tab === "grading" && showLecturer && (
                <section className="section-block">
                    {submissions.length === 0 && <p>No submissions to grade yet.</p>}
                    {submissions.map((assignment) => (
                        <div className="card" key={assignment.id}>
                            <h3>{assignment.title}</h3>
                            {assignment.submissions?.length === 0 && (
                                <p>No submissions for this assignment.</p>
                            )}
                            {assignment.submissions?.map((sub) => (
                                <div className="submission-row" key={sub.id}>
                                    <p>
                                        <strong>{sub.student?.fullName}</strong> — Grade: {sub.grade}
                                    </p>
                                    <a href={`${API_BASE}${sub.fileUrl}`} target="_blank" rel="noreferrer">
                                        View submission
                                    </a>
                                    <button
                                        className="btn btn-inline"
                                        onClick={() => handleGrade(sub.id)}
                                    >
                                        Grade
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default CourseDetail;
