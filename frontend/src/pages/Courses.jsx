import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";

const Courses = () => {
    const { isStudent, isStaff } = useAuth();
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            if (isStaff) {
                const res = await API.get("/courses/my");
                setMyCourses(res.data);
            } else {
                const [allRes, myRes] = await Promise.all([
                    API.get("/courses"),
                    API.get("/enrollments/my-courses")
                ]);
                setCourses(allRes.data);
                setMyCourses(myRes.data.map((e) => e.course).filter(Boolean));
                setEnrolledIds(myRes.data.map((e) => e.courseId));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isStaff]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post("/courses", form);
            setForm({ title: "", description: "" });
            alert("Course created!");
            loadData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create course");
        }
    };

    const enrollCourse = async (courseId) => {
        try {
            await API.post("/enrollments", { courseId });
            alert("Enrolled successfully!");
            loadData();
        } catch (error) {
            alert(error.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) {
        return <div className="page-content"><p>Loading courses...</p></div>;
    }

    if (isStaff) {
        return (
            <div className="page-content">
                <h1>My Courses (Lecturer)</h1>
                <p className="subtitle">Create and manage your classes</p>

                <form className="panel-form" onSubmit={handleCreate}>
                    <h3>Create New Course</h3>
                    <input
                        placeholder="Course title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Course description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn">Create Course</button>
                </form>

                <div className="card-grid">
                    {myCourses.length === 0 && (
                        <p>No courses yet. Create your first course above.</p>
                    )}
                    {myCourses.map((course) => (
                        <div className="card" key={course.id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <Link to={`/courses/${course.id}`} className="btn btn-inline">
                                Manage Course
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <h1>Courses</h1>

            <section className="section-block">
                <h2>My Enrolled Courses</h2>
                <div className="card-grid">
                    {myCourses.length === 0 && <p>You are not enrolled in any course yet.</p>}
                    {myCourses.map((course) => (
                        <div className="card" key={course.id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <Link to={`/courses/${course.id}`} className="btn btn-inline">
                                Open Classroom
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section-block">
                <h2>Browse & Enroll</h2>
                <div className="card-grid">
                    {courses.map((course) => (
                        <div className="card" key={course.id}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            {enrolledIds.includes(course.id) ? (
                                <Link to={`/courses/${course.id}`} className="btn btn-inline">
                                    Open Classroom
                                </Link>
                            ) : (
                                <button
                                    className="btn btn-inline"
                                    onClick={() => enrollCourse(course.id)}
                                >
                                    Enroll
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Courses;
