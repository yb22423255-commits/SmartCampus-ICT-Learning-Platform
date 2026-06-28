const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        dialect: "mysql",
        logging: false,
        dialectOptions: process.env.DB_SSL === "true"
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {}
    }
);

/*
  Function to test database connection
*/
const connectDB = async () => {
    await sequelize.authenticate();
    console.log("Database connected successfully");
};

module.exports = { sequelize, connectDB };