const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Submission = sequelize.define("Submission", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },

    grade: {
        type: DataTypes.STRING,
        defaultValue: "Pending"
    }

});

module.exports = Submission;