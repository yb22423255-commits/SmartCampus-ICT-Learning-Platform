import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        API.get("/enrollments/my-courses")
            .then((res) => setCourses(res.data.map((e) => e.course).filter(Boolean)))
            .catch(console.error);
    }, []);

    return (
        <div className="page-content">
            <h1>My Courses</h1>
            <div className="card-grid">
                {courses.length === 0 && (
                    <p>
                        No enrolled courses. <Link to="/courses">Browse courses</Link> to enroll.
                    </p>
                )}
                {courses.map((course) => (
                    <div className="card" key={course.id}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <Link to={`/courses/${course.id}`} className="btn btn-inline">
                            Open Classroom
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
