import { useEffect, useState } from "react";
import API from "../services/api";

const Grades = () => {
    const [data, setData] = useState({ quizResults: [], submissions: [] });

    useEffect(() => {
        API.get("/dashboard/grades")
            .then((res) => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="page-content">
            <h1>My Grades</h1>

            <section className="section-block">
                <h2>Quiz Results</h2>
                {data.quizResults.length === 0 && <p>No quiz attempts yet.</p>}
                {data.quizResults.map((r) => (
                    <div className="card" key={r.id}>
                        <h3>{r.quiz?.question || "Quiz"}</h3>
                        <p>Your answer: {r.selectedAnswer}</p>
                        <p>Score: {r.score === 1 ? "100%" : "0%"}</p>
                    </div>
                ))}
            </section>

            <section className="section-block">
                <h2>Assignment Grades</h2>
                {data.submissions.length === 0 && <p>No assignment submissions yet.</p>}
                {data.submissions.map((s) => (
                    <div className="card" key={s.id}>
                        <h3>{s.assignment?.title}</h3>
                        <p>Course: {s.assignment?.course?.title}</p>
                        <p>Grade: {s.grade}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Grades;
