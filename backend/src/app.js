const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./Routes/authRoutes");
const enrollmentRoutes = require("./Routes/enrollmentRoutes");
const lessonRoutes = require("./Routes/lessonRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const assignmentRoutes = require("./Routes/assignmentRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const userRoutes = require("./Routes/userRoutes");
const aiRoutes = require("./Routes/aiRoutes");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(null, false);
    },
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/", (req, res) => {
    res.json({
        message: "SmartCampus API is running successfully"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
    if (err.message === "Invalid file type") {
        return res.status(400).json({ message: err.message });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large (max 10MB)" });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
