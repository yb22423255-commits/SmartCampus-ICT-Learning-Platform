const { Sequelize } = require("sequelize");
require("dotenv").config();

/*
  Sequelize = ORM (helps Node.js talk to MySQL easily)
  We are loading database credentials from .env file
*/

const sequelize = new Sequelize(
    process.env.DB_NAME,        // database name
    process.env.DB_USER,        // mysql username
    process.env.DB_PASSWORD,    // mysql password
    {
        host: process.env.DB_HOST,
        dialect: "mysql",       // we are using MySQL
        logging: false          // disables SQL logs in terminal
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