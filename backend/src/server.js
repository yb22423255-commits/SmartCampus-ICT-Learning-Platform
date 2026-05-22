require("dotenv").config();

const app = require("./app");
const { sequelize, connectDB } = require("./config/db");
require("./models/associations");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync();
        console.log("Database synced");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
